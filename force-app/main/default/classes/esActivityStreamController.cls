/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 03-02-2022
 * @last modified by  : ErickSixto
 **/
public with sharing class esActivityStreamController{
    @AuraEnabled(cacheable = true)
    public static list<NoteWrapper> getNotes(String objectApiName){
        try{
            String queryTemplate = 
    'SELECT Id, Name' + 
    ' FROM ' + objectApiName;
            List<NoteWrapper> notes = new List<NoteWrapper>();
            List<SObject> records = Database.query(queryTemplate);
            List<Id> recordIds = new List<Id>();
            for (SObject record : records){
                recordIds.add(record.Id);
            }
            if (recordIds.size() > 0){
                notes = esContentNoteSelector.getNotes(recordIds);

            }
            return notes;
        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

}