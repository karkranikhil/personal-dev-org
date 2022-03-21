/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 03-21-2022
 * @last modified by  : ErickSixto
 **/
trigger ContentDocumentLinkTrigger on ContentDocumentLink(
  before insert,
  before update,
  before delete,
  after insert,
  after update,
  after delete,
  after undelete
) {
  ContentDocumentLinkTriggerHandler handler = new ContentDocumentLinkTriggerHandler();

  //Before Insert
  if (Trigger.isInsert && Trigger.isBefore) {
    handler.OnBeforeInsert(Trigger.new);
  } else if (Trigger.isInsert && Trigger.isAfter) {
    //After Insert
    handler.OnAfterInsert(Trigger.new);
  } else if (Trigger.isDelete && Trigger.isAfter) {
    //After Delete
    handler.OnAfterDelete(Trigger.old, Trigger.oldMap);
  }
  //! Commented: We wont use these scenarios for the requiement. But nonetheless I prepared the trigger handler in case you need them on the future - ErickSixto
  // else if (Trigger.isUpdate && Trigger.isBefore) {
  //   //Before Update
  //   handler.OnBeforeUpdate(Trigger.old, Trigger.new, Trigger.newMap);
  // } else if (Trigger.isUpdate && Trigger.isAfter) {
  //   //After Update
  //   handler.OnAfterUpdate(Trigger.old, Trigger.new, Trigger.newMap);
  // }
  //else if (Trigger.isDelete && Trigger.isBefore) {
  //   //Before Delete
  //   handler.OnBeforeDelete(Trigger.old, Trigger.oldMap);
  // } else if (Trigger.isUndelete) {
  //   //After Undelete
  //   handler.OnUnDelete(Trigger.new);
  // }
}
