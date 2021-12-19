/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 12-19-2021
 * @last modified by  : ErickSixto
 **/
public class EsChecklistController{
    @AuraEnabled
    public static List<Case_Contacts__c> getContacts(String recordId){
        try{
            List<Case_Contacts__c> caseContacts = [SELECT Id, Contact__c, Contact__r.Name, Contact__r.Phone, Contact__r.Email
                                                   FROM Case_Contacts__c
                                                   WHERE Opportunity__c = :recordId];
            if (caseContacts.size() > 0){
                return caseContacts;
            }
            return null;

        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }
    //* This is a DEMO METHOD to fetch a related account of the opportunity for tab 3
    @AuraEnabled
    public static Map<String, String> getRelatedRecordMap(String recordId){
        try{
            Opportunity opp = [SELECT AccountId
                               FROM Opportunity
                               WHERE Id = :recordId];

            //! GET THE RELATED ID OF THE RECORD YOU WANT ( In this example, an account)
            Account acc = [SELECT Id
                           FROM Account
                           WHERE Id = :opp.AccountId];
            Map<String, String> resultMap = new Map<String, String>(); //! The Map must contain the format {Id: recordId, Object: objectApiName}
            resultMap.put('Id', acc.Id);        //! Replace 'acc.Id' with the Id of the related Record
            resultMap.put('Object', 'Account'); //! Replace 'Account' with desired Object Api Name

            return resultMap;


        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static void saveDraftValues(Object data){
        List<Contact> listOfContacts = (List<Contact>)JSON.deserialize(JSON.serialize(data), List<Contact>.class);
        update listOfContacts;
    }
}