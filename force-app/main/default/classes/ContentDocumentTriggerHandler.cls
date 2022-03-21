/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 03-21-2022
 * @last modified by  : ErickSixto
 **/
public with sharing class ContentDocumentTriggerHandler {
  private static Integer runCount = 0;
  public void OnBeforeInsert(List<ContentDocument> newRecords) {
    if (isSNote(newRecords[0])) {
      fireStreamEvent();
    }
  }

  public void OnAfterInsert(List<ContentDocument> newRecords) {
    if (isSNote(newRecords[0])) {
      fireStreamEvent();
    }
  }

  public void OnBeforeUpdate(
    List<ContentDocument> oldRecords,
    List<ContentDocument> newRecords,
    Map<Id, ContentDocument> newRecordsMap
  ) {
    if (isSNote(newRecords[0])) {
      fireStreamEvent();
    }
  }
  public void OnAfterUpdate(
    List<ContentDocument> oldRecords,
    List<ContentDocument> newRecords,
    Map<Id, ContentDocument> newRecordsMap
  ) {
    fireStreamEvent();
  }

  //! Commented: We wont use these scenarios for the requiement. But nonetheless I prepared the trigger handler in case you need them on the future - ErickSixto

  // // On Before Delete
  // public void OnBeforeDelete(
  //   List<ContentDocument> deletedRecords,
  //   Map<Id, ContentDocument> deletedRecordsMap
  // ) {
  // }
  // // On After Delete
  // public void OnAfterDelete(
  //   List<ContentDocument> deletedRecords,
  //   Map<Id, ContentDocument> deletedRecordsMap
  // ) {
  // }
  // // On Undelete
  // public void OnUnDelete(List<ContentDocument> undeletedRecords) {
  // }

  private void fireStreamEvent() {
    Activity_Stream__e activtyStreamEvent = new Activity_Stream__e();
    // Call method to publish events
    Database.SaveResult results = EventBus.publish(activtyStreamEvent);
  }

  private Boolean isSNote(ContentDocument doc) {
    return doc.FileType == 'SNOTE';
  }
}
