/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 03-05-2022
 * @last modified by  : ErickSixto
 **/

@isTest
private class ContentDocumentLinkTriggerHandlerTest {
  @isTest
  private static void OnAfterInsertTest() {
    Contact con = new Contact();
    con.LastName = 'Test';
    insert con;

    ContentNote cn = new ContentNote();
    cn.Title = 'test1';
    String body = 'Hello World';
    cn.Content = Blob.valueOf(body.escapeHTML4());
    insert cn;

    ContentDocumentLink link = new ContentDocumentLink();
    link.ContentDocumentId = cn.Id;
    link.LinkedEntityId = con.Id;
    link.ShareType = 'I';
    link.Visibility = 'AllUsers';
    insert link;

    Test.startTest();

    ContentNote newNote = new ContentNote();
    newNote.Title = 'test2';
    newNote.Content = Blob.valueOf(body.escapeHTML4());
    insert newNote;

    ContentDocumentLink newLink = new ContentDocumentLink();
    newLink.ContentDocumentId = newNote.Id;
    newLink.LinkedEntityId = con.Id;
    newLink.ShareType = 'I';
    newLink.Visibility = 'AllUsers';
    insert newLink;

    Test.stopTest();

    List<ContentDocumentLink> notes = [
      SELECT Id, ContentDocumentId, LinkedEntityId
      FROM ContentDocumentLink
      WHERE LinkedEntityId = :con.Id AND ContentDocument.FileType = 'SNOTE'
      ORDER BY ContentDocument.CreatedDate ASC
    ];
    // Asserts
    System.assert(notes.size() < 2, 'Actual Size: ' + notes.size());
  }
}
