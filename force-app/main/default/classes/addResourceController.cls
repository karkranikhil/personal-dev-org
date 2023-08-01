public class addResourceController {
    
    @AuraEnabled(cacheable=true)
    public static List<Resourcewrapper> getServiceResource(String strAppointmentId){
        List<Resourcewrapper> wrapList = new List<Resourcewrapper>();
        String city = null;
        String street = null;
        String stateCode = null; 
        String countryCode = null;
        ServiceAppointment servappointment = [SELECT Id, Address from ServiceAppointment where id=:strAppointmentId Limit 1];
        Location loc = servappointment.Address;
        Double serlat = loc.latitude;
        Double serlongi = loc.Longitude;
        Location loc1 = Location.newInstance(serlat,serlongi);
        Address customAddress = servappointment.Address;
        
        //Remove white spaces from address components
        if(customAddress.getCity() != null){
             city = customAddress.getCity().deleteWhitespace();
        }
        if(customAddress.getStreet() != null){
             street = customAddress.getStreet().deleteWhitespace();
        }
        if(customAddress.getStateCode() != null){
             stateCode = customAddress.getStateCode();
        }
        if(customAddress.getCountryCode() != null){
             countryCode = customAddress.getCountryCode();
        }    
        
        //concatenate strings
        String address = street+city+stateCode+countryCode;
        List<ServiceResource> lstServResource = [SELECT Id, Preferred_address__Latitude__s ,CreatedDate , Preferred_address__Longitude__s ,Name, IsActive, Preferred_address__c, Email__c, INVIVA_Employment_Status__c,INVIVA_Resource_Type__c FROM ServiceResource WHERE IsActive = true];
        for(ServiceResource sr: lstServResource){
            Double serReslat = sr.Preferred_address__Latitude__s;
            Double serReslongi = sr.Preferred_address__Longitude__s;
            Location loc2 = Location.newInstance(serReslat,serReslongi);
            Double dist = Location.getDistance(loc1, loc2, 'km');
            Double dist2 = loc1.getDistance(loc2, 'km');
            
            String srcity = null;
            String srstreet = null;
            String srstateCode = null; 
            String srcountryCode = null;
            Address srcustomAddress = sr.Preferred_address__c;
            
            //Remove white spaces from address components
            if(srcustomAddress != null && srcustomAddress.getCity() != null){
                srcity = srcustomAddress.getCity().deleteWhitespace();
            }
            if(srcustomAddress != null && srcustomAddress.getStreet() != null){
                srstreet = srcustomAddress.getStreet().deleteWhitespace();
            }
            if(srcustomAddress != null && srcustomAddress.getStateCode() != null){
                srstateCode = srcustomAddress.getStateCode();
            }
            if(srcustomAddress != null && srcustomAddress.getCountryCode() != null){
                srcountryCode = srcustomAddress.getCountryCode();
            }    
            
            //concatenate strings
            String sraddress = srstreet+srcity+srstateCode+srcountryCode;
            
            String key = system.label.Google_API_Key;
            Http httpProtocol = new Http();
            // Create HTTP request to send.
            HttpRequest request = new HttpRequest();
            // Set the endpoint URL.
            // USING GOOGLE MAP API 
            // https://maps.googleapis.com/maps/api/distancematrix/json?origins=Seattle&destinations=San+Francisco&key=system.label.Google_API_Key
            String endpoint = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins='+address+'&destinations='+sraddress+'&key='+key;
            request.setEndPoint(endpoint);
            // Set the HTTP verb to GET.
            request.setMethod('GET');
            // Send the HTTP request and get the response.
            // The response is in JSON format.
            HttpResponse response = httpProtocol.send(request);
            //JSONParser parser = JSON.createParser('{"destination_addresses" : [ "Navrangpura, Ahmedabad, Gujarat, India" ],"origin_addresses" : [ "Nikol, Ahmedabad, Gujarat 380038, India" ],"rows" : [{"elements" : [{ "distance" : {"text" : "13.8 km","value" : 13838},"duration" : {"text" : "38 mins","value" : 2306},"status" : "OK"}]}],"status" : "OK"}');
            JSONParser parser = JSON.createParser(response.getBody());
            system.debug('parser==='+parser);
            //GooglerResponse googlerResponse = (GooglerResponse) JSON.deserialize(response.getBody(), GooglerResponse.Class);
            
            Decimal  distanc;
            
            while (parser.nextToken() != null) {
                if ((parser.getCurrentToken() == JSONToken.FIELD_NAME) && (parser.getText() == 'distance')) {
                    parser.nextToken();
                    parser.nextToken();
                    parser.nextToken();
                    //Get longitude    
                    //distanc = parser.getText();
                    system.debug('distanc == '+distanc);
                    parser.nextToken();
                    parser.nextToken();
                    distanc = parser.getDecimalValue();
                    system.debug('distanc == '+distanc);
                    } 
            }
            if(distanc < 200000){
                Resourcewrapper objResWrap = new Resourcewrapper();
                objResWrap.Id = sr.Id;
                if(distanc != null){
                    //objResWrap.Distance = Decimal.valueof(dist).setScale(2);
                    objResWrap.Distance = distanc/1000 +'km';
                }
                objResWrap.ResourceName = sr.Name;
                objResWrap.CreatedDate = Date.valueof(sr.CreatedDate);
                objResWrap.IsActive = sr.IsActive;
                objResWrap.Email = sr.Email__c;
                objResWrap.EmploymentStatus = sr.INVIVA_Employment_Status__c;
                objResWrap.ResourceType = sr.INVIVA_Resource_Type__c;
                wrapList.add(objResWrap);
            }
        }
        return wrapList;
    }
    @AuraEnabled
    public static AssignedResource saveAppointment(String strRecordId, List<ServiceResource> strLstSerResource){
        set<Id> srIds = new set<Id>();
        for(ServiceResource sr:strLstSerResource){
            srIds.add(sr.Id);
        }
        system.debug(srIds+'srIds');
        List<ServiceResource> lstServResource = [SELECT Id, RelatedRecordId, Preferred_address__Latitude__s ,Preferred_address__Longitude__s ,Name, IsActive, Preferred_address__c, Email__c, INVIVA_Employment_Status__c FROM ServiceResource WHERE IsActive = true And Id IN: srIds];
        
        if(!lstServResource.isEmpty()){
            List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>();
            
            EmailTemplate emailTemplate = [Select id, Subject, Body From EmailTemplate WHERE DeveloperName =: Constant.Send_Service_Resource_Email];
            
            List<AssignedResource> lstAssiRes = new List<AssignedResource>();
            for(ServiceResource sr:lstServResource){
                ServiceResource serviceRes = new ServiceResource();
                serviceRes.RelatedRecordId = sr.Id;
                
                AssignedResource assiRes = new AssignedResource();
                assiRes.ServiceAppointmentId = strRecordId;
                assiRes.ServiceResourceId = sr.Id;
                lstAssiRes.add(assiRes);
                
                // Send Email Logic -- START
                Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
                
                email.setSubject('Test Email');
                email.setTargetObjectId(sr.RelatedRecordId);
                email.setTemplateId(emailTemplate.Id);
                //email.setToAddresses(new String[] {sr.Email__c});
                email.setSaveAsActivity(false);
                email.setWhatId(strRecordId);
                email.setHtmlBody('hello');
                mails.add(email);
                // Send Email Logic -- START
            }
            if(mails.size()>0){
                Messaging.sendEmail(mails);
            }
            if(!lstAssiRes.isEmpty()){
                insert lstAssiRes;
            }
        }
        return null;
    }
    
    public class Resourcewrapper{           
        @AuraEnabled public String Id;
        @AuraEnabled public String ResourceName;
        @AuraEnabled public Boolean IsActive;
        @AuraEnabled public String Email;
        @AuraEnabled public String EmploymentStatus;
        @AuraEnabled public String ResourceType;
        @AuraEnabled public String Distance;
        @AuraEnabled public Date CreatedDate;
        
    }
}