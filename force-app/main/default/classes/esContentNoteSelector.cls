/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 03-01-2022
 * @last modified by  : ErickSixto
 **/
public with sharing class esContentNoteSelector{
    @AuraEnabled(cacheable = true)
    public static List<ContentNote> getNotes(List<Id> recordIds){
        Id userId = UserInfo.getUserId();
        List<Id> noteIds = new List<Id>();
        List<ContentDocumentLink> links = [SELECT Id, ContentDocumentId, LinkedEntityId
                                           FROM ContentDocumentLink
                                           WHERE LinkedEntityId IN:recordIds AND ContentDocument.FileType = 'SNOTE' AND ContentDocument.OwnerId = :userId AND ContentDocument.LastModifiedDate = LAST_N_DAYS:30];
        //
        for (ContentDocumentLink link : links){
            noteIds.add(link.ContentDocumentId);

        }
        List<ContentNote> notes = [SELECT Id, FileType, Title, Content, TextPreview, LastModifiedDate
                                   FROM ContentNote
                                   WHERE Id IN:noteIds];
        return notes;
    }

}