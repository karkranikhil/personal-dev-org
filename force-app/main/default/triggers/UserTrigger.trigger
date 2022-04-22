/**
 * @description       : 
 * @author            : ErickSixto
 * @group             : 
 * @last modified on  : 04-22-2022
 * @last modified by  : ErickSixto
**/
trigger UserTrigger on User(after insert) {
  if (Trigger.isInsert && Trigger.isAfter) {
    RdsLoginController.sendWelcomeEmail(Trigger.new);
  }
}
