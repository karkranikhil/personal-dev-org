/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 03-21-2022
 * @last modified by  : ErickSixto
 **/
public with sharing class ContentVersionTriggerHandler {
  private static Integer runCount = 0;
  public void OnBeforeInsert(List<ContentVersion> newRecords) {
    if (runCount == 0) {
      fireStreamEvent(newRecords[0]);
    }
  }

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
      if (runCount == 0) {
      fireStreamEvent(newRecords[0]);
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

  //! Commented: We wont use these scenarios for the requiement. But nonetheless I prepared the trigger handler in case you need them on the future - ErickSixto

  // // On Before Delete
  // public void OnBeforeDelete(
  //   List<ContentVersion> deletedRecords,
  //   Map<Id, ContentVersion> deletedRecordsMap
  // ) {
  // }
  // // On After Delete
  // public void OnAfterDelete(
  //   List<ContentVersion> deletedRecords,
  //   Map<Id, ContentVersion> deletedRecordsMap
  // ) {
  // }
  // // On Undelete
  // public void OnUnDelete(List<ContentVersion> undeletedRecords) {
  // }

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
}
