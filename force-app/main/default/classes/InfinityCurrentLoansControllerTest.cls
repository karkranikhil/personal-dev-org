/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 01-14-2023
 * @last modified by  : ErickSixto
 **/
@isTest
private class InfinityCurrentLoansControllerTest {
  @testSetup
  static void setup() {
    // create test data here
    List<OTF__c> testOTF = new List<OTF__c>();
    Account acc = new Account();
    acc.Name = 'Test account';
    insert acc;
    for (Integer i = 0; i < 5; i++) {
      testOTF.add(
        new OTF__c(
          Account__c = acc.Id,
          Security_Address__c = 'Test Security Address ' + String.valueOf(i),
          Limit__c = 10000 + i,
          Rate__c = 'Fixed',
          LVR__c = 80,
          Expiry_Date__c = Date.today()
        )
      );
    }
    insert testOTF;

    List<ContentDocumentLink> testCDL = new List<ContentDocumentLink>();
    for (Integer i = 0; i < 5; i++) {
      testCDL.add(
        new ContentDocumentLink(
          LinkedEntityId = testOTF[i].Id,
          ContentDocumentId = '0691e000000yjnIAAQ'
        )
      );
    }
    insert testCDL;
  }

  @isTest
  static void testGetLoans() {
    List<InfinityCurrentLoansController.LoanWrapper> result = InfinityCurrentLoansController.getLoans();
    System.assertEquals(5, result.size(), 'Expected 5 loans to be returned');
  }

  @isTest
  static void testGetLoanByRecordId() {
    OTF__c loan = [SELECT Id FROM OTF__c LIMIT 1];
    OTF__c result = InfinityCurrentLoansController.getLoanByRecordId(loan.Id);
    System.assertNotEquals(null, result, 'Expected a loan to be returned');
  }

  @isTest
  static void testGetExistingDocuments() {
    OTF__c loan = [SELECT Id FROM OTF__c LIMIT 1];
    List<ContentVersion> testCV = new List<ContentVersion>();
    for (Integer i = 0; i < 5; i++) {
      testCV.add(
        new ContentVersion(
          Title = 'Test Document ',
          PathOnClient = 'Test Document ' + i,
          VersionData = Blob.valueOf('Test Content')
        )
      );
    }
    insert testCV;

    List<ContentDocumentLink> testCDL = new List<ContentDocumentLink>();
    for (Integer i = 0; i < 5; i++) {
      testCDL.add(
        new ContentDocumentLink(
          LinkedEntityId = loan.Id,
          ContentDocumentId = testCV[i].ContentDocumentId
        )
      );
    }
    insert testCDL;

    //Act
    List<ContentDocumentLink> result = InfinityCurrentLoansController.getExistingDocuments(
      loan.Id
    );

    //Assert
    System.assertEquals(
      5,
      result.size(),
      'Expected 5 documents to be returned'
    );
    for (Integer i = 0; i < 5; i++) {
      System.assertEquals(
        testCDL[i].ContentDocumentId,
        result[i].ContentDocumentId,
        'Expected ContentDocument Id to match'
      );
    }
  }

  @isTest
  static void testGetLoginURL() {
    String result = InfinityCurrentLoansController.getLoginURL();
  }
}
