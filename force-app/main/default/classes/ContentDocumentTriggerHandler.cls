/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 03-21-2022
 * @last modified by  : ErickSixto
 **/
public with sharing class ContentDocumentTriggerHandler {
  private static Integer runCount = 0;

  // On After Delete
  public void OnAfterDelete(
    List<ContentDocument> deletedRecords,
    Map<Id, ContentDocument> deletedRecordsMap
  ) {
    List<Activity_Stream__e> streamEvents = new List<Activity_Stream__e>();
    streamEvents.add(new Activity_Stream__e());
    // Call method to publish events
    List<Database.SaveResult> results = EventBus.publish(streamEvents);
  }
  // public void OnBeforeInsert(List<ContentDocument> newRecords) {
  // }

  // public void OnAfterInsert(List<ContentDocument> newRecords) {
  // }

  // public void OnBeforeUpdate(
  //   List<ContentDocument> oldRecords,
  //   List<ContentDocument> newRecords,
  //   Map<Id, ContentDocument> newRecordsMap
  // ) {
  // }
  // public void OnAfterUpdate(
  //   List<ContentDocument> oldRecords,
  //   List<ContentDocument> newRecords,
  //   Map<Id, ContentDocument> newRecordsMap
  // ) {
  // }

  // // On Before Delete
  // public void OnBeforeDelete(
  //   List<ContentDocument> deletedRecords,
  //   Map<Id, ContentDocument> deletedRecordsMap
  // ) {
  // }
  // // On Undelete
  // public void OnUnDelete(List<ContentDocument> undeletedRecords) {
  // }
}
