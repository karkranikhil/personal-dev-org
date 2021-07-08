trigger ContactTrigger on Contact(before insert, before update, before delete, after insert, after update, after delete, after undelete ){


	ContactTriggerHandler handler = new ContactTriggerHandler();

	//Before Insert
	if (Trigger.isInsert && Trigger.isBefore){
		handler.OnBeforeInsert(Trigger.new);
	}

	//After Insert
	else if (Trigger.isInsert && Trigger.isAfter){
		handler.OnAfterInsert(Trigger.new);
	}

	//Before Update
	else if (Trigger.isUpdate && Trigger.isBefore){
		handler.OnBeforeUpdate(Trigger.old, Trigger.new, Trigger.newMap);
	}

	//After Update
	else if (Trigger.isUpdate && Trigger.isAfter){
		handler.OnAfterUpdate(Trigger.old, Trigger.new, Trigger.newMap);
	}

	//Before Delete
	else if (Trigger.isDelete && Trigger.isBefore){
		handler.OnBeforeDelete(Trigger.old, Trigger.oldMap);
	}

	//After Delete
	else if (Trigger.isDelete && Trigger.isAfter){
		handler.OnAfterDelete(Trigger.old, Trigger.oldMap);
	}

	//After Undelete
	else if (Trigger.isUndelete){
		handler.OnUnDelete(Trigger.new);
	}
}