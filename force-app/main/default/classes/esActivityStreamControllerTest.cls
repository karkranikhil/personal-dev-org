/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 03-06-2022
 * @last modified by  : ErickSixto
 **/
@isTest
private class esActivityStreamControllerTest {
  @isTest
  private static void getNotesTest() {
    // Test data setup
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
    // Actual test
    Test.startTest();
    List<NoteWrapper> result = esActivityStreamController.getNotes('Contact');
    Test.stopTest();
    // Asserts
    System.assert(result.size() > 0, 'Actual Size: ' + result.size());
  }
  @isTest
  private static void updateNoteTest() {
    // Test data setup
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
    // Actual test
    Test.startTest();
    esActivityStreamController.updateNote(cn.Id, 'Updated');
    Test.stopTest();
    // Asserts
    ContentNote note = [
      SELECT Id, TextPreview
      FROM ContentNote
      WHERE Id = :cn.Id
    ];
    System.assertEquals('Updated', note.TextPreview);
  }
}
