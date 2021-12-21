/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 12-20-2021
 * @last modified by  : ErickSixto
 **/
@isTest
private class EsChecklistControllerTest{
    @isTest
    private static void positiveTest(){
        List<Account> testAccounts = createTestAccounts(2);
        List<Contact> testContacts = generateRandomContacts(5, 'Tester');
        List<Opportunity> testOpps = createTestOpportunities(testAccounts[0].Id, 2);
        List<Case_Contacts__c> testCaseContacts = generateRandomCaseContacts(3, testContacts[0].Id, testOpps[0].Id);
        Id oppId = [SELECT Id
                    FROM Opportunity
                    LIMIT 1].Id;

        Test.startTest();

        List<Case_Contacts__c> ccons = EsChecklistController.getContacts(oppId);
        Map<String, String> recordMap = EsChecklistController.getRelatedRecordMap(oppId);

        Test.stopTest();
    }
    @isTest
    private static void negativeTest(){
        List<Account> testAccounts = createTestAccounts(2);
        List<Opportunity> testOpps = createTestOpportunities(testAccounts[0].Id, 2);
        Id oppId = [SELECT Id
                    FROM Opportunity
                    LIMIT 1].Id;

        Test.startTest();

        List<Case_Contacts__c> ccons = EsChecklistController.getContacts(oppId);
        Map<String, String> recordMap = EsChecklistController.getRelatedRecordMap(oppId);

        Test.stopTest();
    }
    @isTest
    private static void saveDraftTest(){
        List<Account> testAccounts = createTestAccounts(2);
        List<Contact> testContacts = generateRandomContacts(5, 'Tester');
        List<Opportunity> testOpps = createTestOpportunities(testAccounts[0].Id, 2);
        List<Case_Contacts__c> testCaseContacts = generateRandomCaseContacts(3, testContacts[0].Id, testOpps[0].Id);
        Id conId = [SELECT Id
                    FROM Contact
                    LIMIT 1].Id;


        Test.startTest();
        Map<String, String> dataMap = new Map<String, String>();
        dataMap.put('Id', conId);
        dataMap.put('LastName', 'Test');

        List<Map<String, String>> mapList = new List<Map<String, String>>();
        mapList.add(dataMap);
        EsChecklistController.saveDraftValues(mapList);

        Test.stopTest();
    }
    public static List<Contact> generateRandomContacts(Integer noOfCon, String conLstNm){
        List<Contact> lstOfConts = new List<Contact>();
        for (Integer i = 1; i <= noOfCon; i++){
            Contact con = new Contact(FirstName = 'Test' + i, LastName = conLstNm);
            lstOfConts.add(con);
        }
        insert lstOfConts;
        return lstOfConts;
    }
    public static List<Case_Contacts__c> generateRandomCaseContacts(Integer noOfCon, Id conId, Id oppId){
        List<Case_Contacts__c> lstOfCaseConts = new List<Case_Contacts__c>();
        for (Integer i = 1; i <= noOfCon; i++){
            Case_Contacts__c con = new Case_Contacts__c(Contact__c = conId, Opportunity__c = oppId);
            lstOfCaseConts.add(con);
        }
        insert lstOfCaseConts;
        return lstOfCaseConts;
    }
    public static List<Account> createTestAccounts(Integer noOfAcc){
        List<Account> accts = new List<Account>();

        for (Integer i = 0; i < noOfAcc; i++){
            Account a = new Account(Name = 'TestAccount' + i);
            accts.add(a);
        }

        insert accts;
        return accts;
    }
    public static List<Opportunity> createTestOpportunities(Id accountId, Integer numOpps){
        List<Opportunity> opps = new List<Opportunity>();
        for (Integer i = 1; i <= numOpps; i++){
            Opportunity opp = new Opportunity();
            opp.name = 'Account ' + i;
            opp.accountId = accountid;
            opp.amount = 1000;
            opp.closeDate = Date.today().addDays(5);
            opp.stageName = 'Prospecting';
            opps.add(opp);
        }
        insert opps;
        return opps;
    }
}