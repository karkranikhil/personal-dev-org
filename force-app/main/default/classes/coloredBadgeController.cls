public with sharing class coloredBadgeController{
	@AuraEnabled
	public static String[] getPicklistValues(String objectApiName, String fieldApiName){
		List<String> myPicklist = new List<String>();
		//? Gets the piclist values of the Story Object
		// Get the describe for the object
		DescribeSObjectResult objResult = Schema.getGlobalDescribe().get(objectApiName).getDescribe();
		// Get the field dynamically
		DescribeFieldResult field = objResult.fields.getMap().get(fieldApiName).getDescribe();
        for (Schema.PicklistEntry f : field.getPicklistValues()){
			//* Add the picklist Value
			myPicklist.add(f.getValue());
		}
		return myPicklist;
	}
}