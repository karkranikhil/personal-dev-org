
public class CaseRelatedListController {
    @AuraEnabled(cacheable=true)
    public static List<Case> getRelatedRecords() {
        return [SELECT Id, CaseNumber, ContactId, Account.Name , Contact.Name,  AccountId FROM Case LIMIT 5];
    }
    
    @AuraEnabled
    public static void saveDraftValues(Object data) {
        List<Case> listOfCases = (List<Case>) JSON.deserialize(
            JSON.serialize(data),
            List<Case>.class
        );
        update listOfCases;
    }
}
