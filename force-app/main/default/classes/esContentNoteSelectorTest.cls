/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 03-06-2022
 * @last modified by  : ErickSixto
 **/
@isTest
private class esContentNoteSelectorTest {
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
    List<Id> recordIds = new List<Id>();
    recordIds.add(con.Id);
    List<NoteWrapper> result = esContentNoteSelector.getNotes(recordIds);
    Test.stopTest();
    // Asserts
    System.assert(result.size() > 0, 'Actual Size: ' + result.size());
  }
}
