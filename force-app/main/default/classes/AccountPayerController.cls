public with sharing class AccountPayerController {
    @AuraEnabled(cacheable=true)
    public static String getPayerIdFromRecord(String recordId, String objectApiName, String payerFieldApiName) {
        String payerId;
        
        // Create a dynamic SOQL query
        String queryString = 'SELECT ' + payerFieldApiName + ' FROM ' + objectApiName + ' WHERE Id = :recordId';

        // Perform the query
        SObject record = Database.query(queryString);

        // Get the value of the payer field
        payerId = (String) record.get(payerFieldApiName);

        return payerId;
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(String payerId) {
        return [SELECT Name, Type, Phone 
                FROM Account 
                WHERE Id IN (SELECT Account__c 
                             FROM Account_Payer__c 
                             WHERE pVerify_Payer__c = :payerId)];
    }
}
