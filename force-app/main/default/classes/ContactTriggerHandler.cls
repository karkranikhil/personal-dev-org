public with sharing class ContactTriggerHandler{
    // On Before Insert
    public void OnBeforeInsert(List<Contact> newRecords){
    }

    public void OnAfterInsert(List<Contact> newRecords){
        System.debug('Inside After Insert');
        ContactCountHandler.handleIncrease(newRecords);
    }

    // On Before Update
    public void OnBeforeUpdate(List<Contact> oldRecords, List<Contact> newRecords, Map<Id, Contact> newRecordsMap){
    }

    // After Update
    public void OnAfterUpdate(List<Contact> oldRecords, List<Contact> newRecords, Map<Id, Contact> newRecordsMap){
    }

    // On Before Delete
    public void OnBeforeDelete(List<Contact> deletedRecords, Map<Id, Contact> deletedRecordsMap){
    }

    // On After Delete
    public void OnAfterDelete(List<Contact> deletedRecords, Map<Id, Contact> deletedRecordsMap){

        ContactCountHandler.handleDecrease(deletedRecords);
    }

    // On Undelete
    public void OnUnDelete(List<Contact> undeletedRecords){
    }
}