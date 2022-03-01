/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 03-01-2022
 * @last modified by  : ErickSixto
 **/
public with sharing class esContentNoteSelector{
    @AuraEnabled
    public static List<ContentNote> getNotes(List<Id> recordIds){
        List<ContentNote> notes = [SELECT Id, FileType, Title, Content, TextPreview
                                   FROM ContentNote];
        List<ContentDocumentLink> links = [SELECT Id, LinkedEntityId, ContentDocumentId, ContentDocument.FileType, ContentDocument.Title, ContentDocument.OwnerId
                                           FROM ContentDocumentLink
                                           WHERE LinkedEntityId IN:recordIds];
        try{

        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

}