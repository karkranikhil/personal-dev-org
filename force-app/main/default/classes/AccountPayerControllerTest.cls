@isTest(SeeAllData=true)
public class AccountPayerControllerTest {
    @isTest
    static void testGetPayerIdFromRecord() {
        // Get a random Lead record
        List<Lead> leads = [SELECT Id , pVerify__PV_Payer__c FROM Lead WHERE pVerify__PV_Payer__c != null LIMIT 1];
        Lead randomLead = leads.isEmpty() ? null : leads[0];

        if (randomLead != null) {
            String recordId = randomLead.Id;
            String objectApiName = 'Lead';
            String payerFieldApiName = 'pVerify__PV_Payer__c'; // Assuming 'pVerify__PV_Payer__c' is the payer field

            // Call the method to test
            Test.startTest();
            String payerId = AccountPayerController.getPayerIdFromRecord(recordId, objectApiName, payerFieldApiName);
            Test.stopTest();

            // Verify the result (add your assertions here)
        }
    }

    @isTest
    static void testGetAccounts() {
        // Get a random Lead record
        List<Lead> leads = [SELECT Id , pVerify__PV_Payer__c FROM Lead WHERE pVerify__PV_Payer__c != null LIMIT 1];
        Lead randomLead = leads.isEmpty() ? null : leads[0];

        if (randomLead != null) {
            Integer maxLimit = 5;

            // Call the method to test
            Test.startTest();
            List<AccountPayerController.AccountWrapper> accountWrappers = AccountPayerController.getAccounts(randomLead.pVerify__PV_Payer__c, maxLimit);
            Test.stopTest();

            // Verify the result (add your assertions here)
        }
    }
}
