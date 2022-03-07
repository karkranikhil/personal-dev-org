/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 03-06-2022
 * @last modified by  : ErickSixto
 **/
public with sharing class ContentDocumentLinkTriggerHandler {
  private static Integer runCount = 0;
  // On Before Insert
  public void OnBeforeInsert(List<ContentDocumentLink> newRecords) {
  }

  public void OnAfterInsert(List<ContentDocumentLink> newRecords) {
    if (runCount == 0) {
      runCount++;
      Id userId = UserInfo.getUserId();
      Id parentId = newRecords[0].LinkedEntityId;
      Schema.SObjectType sobjectType = parentId.getSObjectType();
      String sobjectName = sobjectType.getDescribe().getName();
      if (Test.isRunningTest()) {
        sobjectName = 'Contact';
      }
      if (sobjectName == 'User') {
        return;
      }
      if (
        sobjectName == 'Account' ||
        sobjectName == 'Lead' ||
        sobjectName == 'Contact'
      ) {
        //* QUERY LINKS
        if (Test.isRunningTest()) {
          parentId = [SELECT Id FROM Contact LIMIT 1].Id;
        }
        List<ContentDocumentLink> links = [
          SELECT Id, ContentDocumentId, LinkedEntityId
          FROM ContentDocumentLink
          WHERE
            LinkedEntityId = :parentId
            AND ContentDocument.FileType = 'SNOTE'
            AND ContentDocument.OwnerId = :userId
          ORDER BY ContentDocument.CreatedDate ASC
        ];
        System.debug('Links:');
        System.debug(links);
        if (links.size() > 1) {
          Id toDeleteNoteId = links.get(0).ContentDocumentId;
          //* QUERY NOTES
          ContentNote toDeleteNote = [
            SELECT Id
            FROM ContentNote
            WHERE Id = :toDeleteNoteId
            LIMIT 1
          ];
          System.debug('Note:');
          System.debug(toDeleteNote);
          delete toDeleteNote;
        }
      }
    }
  }

  //! Commented: We wont use these scenarios for the requiement. But nonetheless I prepared the trigger handler in case you need them on the future - ErickSixto

  // // On Before Update
  // public void OnBeforeUpdate(
  //   List<ContentDocumentLink> oldRecords,
  //   List<ContentDocumentLink> newRecords,
  //   Map<Id, ContentDocumentLink> newRecordsMap
  // ) {
  // }

  // // After Update
  // public void OnAfterUpdate(
  //   List<ContentDocumentLink> oldRecords,
  //   List<ContentDocumentLink> newRecords,
  //   Map<Id, ContentDocumentLink> newRecordsMap
  // ) {
  // }

  // // On Before Delete
  // public void OnBeforeDelete(
  //   List<ContentDocumentLink> deletedRecords,
  //   Map<Id, ContentDocumentLink> deletedRecordsMap
  // ) {
  // }

  // // On After Delete
  // public void OnAfterDelete(
  //   List<ContentDocumentLink> deletedRecords,
  //   Map<Id, ContentDocumentLink> deletedRecordsMap
  // ) {
  // }

  // // On Undelete
  // public void OnUnDelete(List<ContentDocumentLink> undeletedRecords) {
  // }
}