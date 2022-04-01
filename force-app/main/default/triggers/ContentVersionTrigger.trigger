/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 04-01-2022
 * @last modified by  : ErickSixto
 **/
trigger ContentVersionTrigger on ContentVersion(
  before insert,
  before update,
  before delete,
  after insert,
  after update,
  after delete,
  after undelete
) {
  ContentVersionTriggerHandler handler = new ContentVersionTriggerHandler();
  if (Trigger.isInsert && Trigger.isAfter) {
    //After Insert
    handler.OnAfterInsert(Trigger.new);
  } else if (Trigger.isUpdate && Trigger.isBefore) {
    //Before Update
    handler.OnBeforeUpdate(Trigger.old, Trigger.new, Trigger.newMap);
  } else if (Trigger.isUpdate && Trigger.isAfter) {
    //After Update
    handler.OnAfterUpdate(Trigger.old, Trigger.new, Trigger.newMap);
  }
  // else if (Trigger.isDelete && Trigger.isAfter) {
  //   //After Delete
  //   handler.OnAfterDelete(Trigger.old, Trigger.oldMap);
  // }
  // else if (Trigger.isInsert && Trigger.isBefore) {
  //   //Before Insert
  //   handler.OnBeforeInsert(Trigger.new);
  // } else if (Trigger.isUpdate && Trigger.isBefore) {
  //   //Before Update
  //   handler.OnBeforeUpdate(Trigger.old, Trigger.new, Trigger.newMap);
  // } else if (Trigger.isDelete && Trigger.isBefore) {
  //   //Before Delete
  //   handler.OnBeforeDelete(Trigger.old, Trigger.oldMap);
  // } else if (Trigger.isUndelete) {
  //   //After Undelete
  //   handler.OnUnDelete(Trigger.new);
  // }
}
