/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 01-19-2023
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
    ContentVersion contentVersion = new ContentVersion(
      Title = 'a picture',
      PathOnClient = 'Pic.jpg',
      VersionData = Blob.valueOf('Test Content'),
      IsMajorVersion = true
    );
    insert contentVersion;
    List<ContentDocument> documents = [
      SELECT Id, Title, LatestPublishedVersionId
      FROM ContentDocument
    ];

    ContentDocumentLink cdl = new ContentDocumentLink();
    cdl.LinkedEntityId = loan.Id;
    cdl.ContentDocumentId = documents[0].Id;
    cdl.ShareType = 'V';
    cdl.Visibility = 'AllUsers';
    insert cdl;

    //Act
    List<ContentDocumentLink> result = InfinityCurrentLoansController.getExistingDocuments(
      loan.Id
    );
  }

  @isTest
  static void testGetLoginURL() {
    String result = InfinityCurrentLoansController.getLoginURL();
  }
  @isTest
  static void testGetExperienceURL() {
    String result = InfinityCurrentLoansController.getExperienceURL();
  }
}
