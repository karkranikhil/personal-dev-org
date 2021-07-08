public with sharing class AccountTriggerHandler extends TriggerHandler{
	private Map<Id, Account> newAccMap;
	private Map<Id, Account> oldAccMap;

	public AccountTriggerHandler(){
		this.newAccMap = (Map<Id, Account>)Trigger.newMap;
		this.oldAccMap = (Map<Id, Account>)Trigger.oldMap;
	}

	public override void beforeUpdate(){

		for (Id accId : Trigger.newMap.keySet()){
			AccountTriggerHelper.reverseDescription(this.newAccMap.get(accId), this.oldAccMap.get(accId));
		}
	}
}