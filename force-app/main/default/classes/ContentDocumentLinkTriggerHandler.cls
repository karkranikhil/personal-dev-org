/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 03-05-2022
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
      if (sobjectName == 'User') {
        if (!Test.isRunningTest()) {
          return;
        }
      }
      if (
        sobjectName == 'Account' ||
        sobjectName == 'Contact' ||
        sobjectName == 'Lead'
      ) {
        //* QUERY LINKS
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

  // On Before Update
  public void OnBeforeUpdate(
    List<ContentDocumentLink> oldRecords,
    List<ContentDocumentLink> newRecords,
    Map<Id, ContentDocumentLink> newRecordsMap
  ) {
  }

  // After Update
  public void OnAfterUpdate(
    List<ContentDocumentLink> oldRecords,
    List<ContentDocumentLink> newRecords,
    Map<Id, ContentDocumentLink> newRecordsMap
  ) {
  }

  // On Before Delete
  public void OnBeforeDelete(
    List<ContentDocumentLink> deletedRecords,
    Map<Id, ContentDocumentLink> deletedRecordsMap
  ) {
  }

  // On After Delete
  public void OnAfterDelete(
    List<ContentDocumentLink> deletedRecords,
    Map<Id, ContentDocumentLink> deletedRecordsMap
  ) {
  }

  // On Undelete
  public void OnUnDelete(List<ContentDocumentLink> undeletedRecords) {
  }
}
