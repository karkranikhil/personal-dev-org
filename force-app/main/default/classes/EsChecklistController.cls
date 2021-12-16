/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 12-15-2021
 * @last modified by  : ErickSixto
 **/
public class EsChecklistController{
    @AuraEnabled
    public static List<Case_Contacts__c> getContacts(String recordId){
        try{
            List<Case_Contacts__c> caseContacts = [SELECT Id, Contact__r.Name, Contact__r.Phone, Contact__r.Email
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
}