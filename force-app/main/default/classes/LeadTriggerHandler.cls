public with sharing class LeadTriggerHandler extends TriggerHandler {
    public LeadTriggerHandler() {
        //? Only runs the handler a defined amount of times per transaction
        this.setMaxLoopCount(1);
    }
}
