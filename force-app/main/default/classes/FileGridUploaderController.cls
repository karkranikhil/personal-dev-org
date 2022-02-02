/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 02-01-2022
 * @last modified by  : ErickSixto
 **/
public with sharing class FileGridUploaderController{
    @AuraEnabled
    public static List<ContentDocumentLink> getExistingDocuments(String recordId, String recordName, List<String> fieldLabels){
        try{
            Set<String> labelsSet = new Set<String>();
            for (String label : fieldLabels){
                String title = label + '_' + recordName;
                labelsSet.add(title);
            }
            List<ContentDocumentLink> cdList = [SELECT Id, ContentDocument.Id, ContentDocument.LatestPublishedVersion.Title, ContentDocument.FileExtension, ContentDocument.LatestPublishedVersion.Id
                                                FROM ContentDocumentLink
                                                WHERE LinkedEntityId = :recordId AND ContentDocument.LatestPublishedVersion.Title IN:labelsSet
                                                ORDER BY ContentDocument.LatestPublishedVersion.CreatedDate DESC];
            if (cdList.size() > 0){
                return cdList;
            } else{
                return null;
            }
        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

}