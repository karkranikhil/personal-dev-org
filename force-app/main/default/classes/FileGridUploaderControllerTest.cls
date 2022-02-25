/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 02-25-2022
 * @last modified by  : ErickSixto
 **/
@isTest
private class FileGridUploaderControllerTest{
    @isTest
    private static void testTestCase(){
        Contact con = new Contact();
        con.LastName = 'Contact';
        insert con;

        ContentVersion contentVersion = new ContentVersion(Title = 'Field_Contact', PathOnClient = 'Pic.jpg', VersionData = Blob.valueOf('Test Content'), IsMajorVersion = true);
        insert contentVersion;

        List<ContentDocument> documents = [SELECT Id, Title, LatestPublishedVersionId
                                           FROM ContentDocument];

        ContentDocumentLink cdl = new ContentDocumentLink();
        cdl.LinkedEntityId = con.Id;
        cdl.ContentDocumentId = documents[0].Id;
        cdl.ShareType = 'V';
        cdl.Visibility = 'AllUsers';
        insert cdl;
        // Actual test
        Test.startTest();
        List<String> fields = new List<String>();
        fields.add('Field');
        List<ContentDocumentLink> docs = FileGridUploaderController.getExistingDocuments(con.Id, 'Contact', fields);
        List<ContentDocumentLink> emptyDocs = FileGridUploaderController.getExistingDocuments(con.Id, 'Not Contact', fields);
        System.assert(docs.size() > 0);
        Test.stopTest();
    }

}