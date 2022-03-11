/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 03-11-2022
 * @last modified by  : ErickSixto
 **/
public with sharing class esContentNoteSelector{
  @AuraEnabled(cacheable = true)
  public static List<NoteWrapper> getNotes(List<Id> recordIds){
    Id userId = UserInfo.getUserId();
    List<NoteWrapper> results = new List<NoteWrapper>();
    Map<Id, String> noteMap = new Map<Id, String>();
    Map<Id, String> linkMap = new Map<Id, String>();
    List<ContentDocumentLink> links = [SELECT Id, ContentDocumentId, LinkedEntityId, LinkedEntity.Name
                                   FROM ContentDocumentLink
                                   WHERE LinkedEntityId IN:recordIds AND ContentDocument.FileType = 'SNOTE' AND ContentDocument.OwnerId = :userId AND ContentDocument.LastModifiedDate = LAST_N_DAYS:90
                                   ORDER BY ContentDocument.LastModifiedDate ASC];
    //
    for (ContentDocumentLink link : links){
      linkMap.put(link.LinkedEntityId, link.ContentDocumentId);
      noteMap.put(link.ContentDocumentId, link.LinkedEntity.Name);
    }
    List<ContentNote> notes = [SELECT Id, FileType, Title, Content, TextPreview, LastModifiedDate
                           FROM ContentNote
                           WHERE Id IN:linkMap.values()
                           ORDER BY LastModifiedDate DESC];

    for (ContentNote note : notes){
      NoteWrapper wrapper = new NoteWrapper();
      wrapper.Id = note.Id;
      wrapper.Title = note.Title;
      wrapper.Content = note.TextPreview;
      wrapper.originalValue = String.isEmpty(note.TextPreview) ? '' : note.TextPreview;
      wrapper.isModified = false;
      wrapper.LastModifiedDate = note.LastModifiedDate;
      wrapper.RecordName = noteMap.get(note.Id);
      wrapper.RecordId = findRecordIdByName(links, noteMap.get(note.Id));
      results.add(wrapper);
    }
    return results;
  }

  private static Id findRecordIdByName(List<ContentDocumentLink> links, String recordName){
    for (ContentDocumentLink link : links){
      if (link.LinkedEntity.Name == recordName){
        return link.LinkedEntityId;
      }
    }
    return null;
  }

}