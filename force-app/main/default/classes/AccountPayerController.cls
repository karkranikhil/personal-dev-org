public with sharing class AccountPayerController{
    @AuraEnabled(cacheable = true)
    public static String getPayerIdFromRecord(String recordId, String objectApiName, String payerFieldApiName){
        String payerId;

        // Create a dynamic SOQL query
        String queryString = 'SELECT ' + payerFieldApiName + ' FROM ' + objectApiName + ' WHERE Id = :recordId';

        // Perform the query
        SObject record = Database.query(queryString);

        // Get the value of the payer field
        payerId = (String) record.get(payerFieldApiName);

        return payerId;
    }

    @AuraEnabled(cacheable = true)
    public static List<AccountWrapper> getAccounts(String payerId, Integer maxLimit){
        List<Account> accounts = [SELECT Id, Name, Account_Type__c, Phone, Preferred_Partner__c,Total_True_Refer_Outs_Last_60_Days__c
                                  FROM Account
                                  WHERE Id IN (SELECT Account__c
                                               FROM Account_Payer__c
                                               WHERE pVerify_Payer__c = :payerId)
                                  ORDER BY Preferred_Partner__c DESC, Total_True_Refer_Outs_Last_60_Days__c DESC LIMIT :maxLimit];

        List<AccountWrapper> accountWrappers = new List<AccountWrapper>();

        for (Account a : accounts){
            AccountWrapper aw = new AccountWrapper();
            aw.Id = a.Id;
            aw.Name = a.Name;
            aw.AccountType = a.Account_Type__c;
            aw.Phone = a.Phone;
            aw.PreferredPartner = a.Preferred_Partner__c;
            aw.Aftercares = a.Total_True_Refer_Outs_Last_60_Days__c;
            aw.nameUrl = '/' + a.Id;
            accountWrappers.add(aw);
        }

        return accountWrappers;
    }

    public class AccountWrapper{
        @AuraEnabled
        public String Id;
        @AuraEnabled
        public String Name;
        @AuraEnabled
        public String nameUrl;
        @AuraEnabled
        public String AccountType;
        @AuraEnabled
        public String Phone;
        @AuraEnabled
        public Boolean PreferredPartner;
        @AuraEnabled
        public Decimal Aftercares;

    }

}