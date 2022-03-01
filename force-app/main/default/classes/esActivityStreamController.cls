/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 03-01-2022
 * @last modified by  : ErickSixto
 **/
public with sharing class esActivityStreamController{
    @AuraEnabled(cacheable = true)
    public static list<SObject> getNotes(String objectApiName){
        try{
            String queryTemplate = 
    'SELECT Id, Name' + 
    ' FROM ' + objectApiName;
            List<SObject> records = Database.query(queryTemplate);
            return records;
            // List<Id> recordIds = new List<Id>();
            // for (SObject record : records){
            //     recordIds.add(record.Id);
            // }
            // if (records.size() > 0){
            //     List<ContentNote> notes = esContentNoteSelector.getNotes(recordIds);
            // }
            // return null;
        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

}