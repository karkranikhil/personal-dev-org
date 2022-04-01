/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 04-01-2022
 * @last modified by  : ErickSixto
 **/
public with sharing class ContentVersionTriggerHandler {
  private static Integer runCount = 0;

  public void OnAfterInsert(List<ContentVersion> newRecords) {
    if (runCount == 0) {
      fireStreamEvent(newRecords[0]);
    }
  }

  public void OnBeforeUpdate(
    List<ContentVersion> oldRecords,
    List<ContentVersion> newRecords,
    Map<Id, ContentVersion> newRecordsMap
  ) {
    ContentVersion note = newRecords[0];
    ContentVersion oldNote = oldRecords[0];

    if (isSNote(note)) {
      note.Title = oldNote.Title;
    }
  }

  public void OnAfterUpdate(
    List<ContentVersion> oldRecords,
    List<ContentVersion> newRecords,
    Map<Id, ContentVersion> newRecordsMap
  ) {
    if (runCount == 0) {
      fireStreamEvent(newRecords[0]);
    }
  }
  private void fireStreamEvent(ContentVersion doc) {
    if (isSNote(doc)) {
      List<Activity_Stream__e> streamEvents = new List<Activity_Stream__e>();
      streamEvents.add(new Activity_Stream__e());
      // Call method to publish events
      List<Database.SaveResult> results = EventBus.publish(streamEvents);
    }
  }
  private Boolean isSNote(ContentVersion doc) {
    return doc.FileType == 'SNOTE';
  }

  //
  //    public void OnBeforeInsert(List<ContentVersion> newRecords) {
  //   }

  //   // On After Delete
  //   public void OnAfterDelete(
  //     List<ContentVersion> deletedRecords,
  //     Map<Id, ContentVersion> deletedRecordsMap
  //   ) {
  //   }
  //  // On Undelete
  //   public void OnUnDelete(List<ContentVersion> undeletedRecords) {
  //   }
  // // On Before Delete
  // public void OnBeforeDelete(
  //   List<ContentVersion> deletedRecords,
  //   Map<Id, ContentVersion> deletedRecordsMap
  // ) {

  // }
}
