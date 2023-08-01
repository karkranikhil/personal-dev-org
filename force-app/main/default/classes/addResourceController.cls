public class addResourceController {
    
    @AuraEnabled(cacheable=true)
    public static List<Resourcewrapper> getServiceResource(String strAppointmentId){
        List<Resourcewrapper> wrapList = new List<Resourcewrapper>();
        String city = null;
        String street = null;
        String stateCode = null; 
        String countryCode = null;
        
        // Log the record ID received from the LWC
        system.debug('@@Record ID received from LWC: ' + strAppointmentId);
        
        ServiceAppointment servappointment = [SELECT Id, Address FROM ServiceAppointment WHERE Id = :strAppointmentId LIMIT 1];
        if (servappointment != null && servappointment.Address != null) {
            Location loc = servappointment.Address;
            Double serlat = loc.latitude;
            Double serlongi = loc.Longitude;
            Location loc1 = Location.newInstance(serlat, serlongi);
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
            String address = street + city + stateCode + countryCode;
            List<ServiceResource> lstServResource = [SELECT Id, Preferred_address__Latitude__s ,CreatedDate , Preferred_address__Longitude__s ,Name, IsActive, Preferred_address__c, Email__c, INVIVA_Employment_Status__c,INVIVA_Resource_Type__c FROM ServiceResource WHERE IsActive = true];
            for(ServiceResource sr : lstServResource){
                Double serReslat = sr.Preferred_address__Latitude__s;
                Double serReslongi = sr.Preferred_address__Longitude__s;
                Location loc2 = Location.newInstance(serReslat, serReslongi);
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
                String sraddress = srstreet + srcity + srstateCode + srcountryCode;
                
                // Log various variables for debugging
                system.debug('@@SeFixed rviceResource ID: ' + sr.Id);
                system.debug('@@ServiceResource Name: ' + sr.Name);
                system.debug('@@Preferred Address: ' + sr.Preferred_address__c);
                system.debug('@@ServiceResource Latitude: ' + serReslat);
                system.debug('@@ServiceResource Longitude: ' + serReslongi);
                system.debug('@@Distance from Location to ServiceResource: ' + dist);
                system.debug('@@Address: ' + sraddress);
                                
                if(dist < 200000){
                    Resourcewrapper objResWrap = new Resourcewrapper();
                    objResWrap.Id = sr.Id;
                    if(dist != null){
                        objResWrap.Distance = dist / 1000 + 'km';
                    }
                    objResWrap.ResourceName = sr.Name;
                    objResWrap.CreatedDate = Date.valueOf(sr.CreatedDate);
                    objResWrap.IsActive = sr.IsActive;
                    objResWrap.Email = sr.Email__c;
                    objResWrap.EmploymentStatus = sr.INVIVA_Employment_Status__c;
                    objResWrap.ResourceType = sr.INVIVA_Resource_Type__c;
                    wrapList.add(objResWrap);
                }
            }
        } else {
            // Log an error when ServiceAppointment is not found or Address is null
            system.debug('@@Error: ServiceAppointment not found or Address is null');
        }
        return wrapList;
    }
    
    public static AssignedResource saveAppointment(String strRecordId, List<ServiceResource> strLstSerResource){
        set<Id> srIds = new set<Id>();
        for(ServiceResource sr : strLstSerResource){
            srIds.add(sr.Id);
        }
        system.debug('@@Service Resource IDs: ' + srIds);
        
        List<ServiceResource> lstServResource = [SELECT Id, RelatedRecordId, Preferred_address__Latitude__s, Preferred_address__Longitude__s, Name, IsActive, Preferred_address__c, Email__c, INVIVA_Employment_Status__c FROM ServiceResource WHERE IsActive = true AND Id IN :srIds];
        
        if(!lstServResource.isEmpty()){
            List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>();
            
            EmailTemplate emailTemplate = [SELECT Id, Subject, Body FROM EmailTemplate WHERE DeveloperName =: Constant.Send_Service_Resource_Email];
            
            List<AssignedResource> lstAssiRes = new List<AssignedResource>();
            for(ServiceResource sr : lstServResource){
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
            if(mails.size() > 0){
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
