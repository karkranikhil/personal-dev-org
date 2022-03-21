/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 03-21-2022
 * @last modified by  : ErickSixto
 **/
public with sharing class esActivityStreamController {
  @AuraEnabled
  public static list<NoteWrapper> getNotes(String objectApiName) {
    String queryTemplate = 'SELECT Id, Name' + ' FROM ' + objectApiName;
    List<NoteWrapper> notes = new List<NoteWrapper>();
    List<SObject> records = Database.query(queryTemplate);
    List<Id> recordIds = new List<Id>();
    for (SObject record : records) {
      recordIds.add(record.Id);
    }
    if (recordIds.size() > 0) {
      notes = esContentNoteSelector.getNotes(recordIds);
    }
    return notes;
  }

  @AuraEnabled
  public static void updateNote(Id recordId, String value) {
    ContentNote cn = new ContentNote();
    cn.Id = recordId;
    String body = value;
    cn.Content = Blob.valueOf(body.escapeHTML4());
    update (cn);
  }
}
