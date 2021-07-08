public with sharing class blogCardStoryDemo{
    //! Gets the Stories Wrapped in Classes that have the format required to use in the component
	@AuraEnabled
	public static List<SectionWrap> getStories(){
        //? List of wrapped object
		List<SectionWrap> toReturn = new List<SectionWrap>();
		List<String> myPicklist = new List<String>();
        //? Gets the piclist values of the Story Object
		Schema.DescribeFieldResult field = Story__c.Category__c.getDescribe();
		for (Schema.PicklistEntry f : field.getPicklistValues())
            //* Add the picklist Value
			myPicklist.add(f.getValue());
         //! For each picklist value, gets the list of Stories with that category
		for (String category : myPicklist){
			SectionWrap wrap = new SectionWrap();
            List<StoryWrap> sections = new List<StoryWrap>();
			wrap.headerTitle = category;
			for (Story__c st : [SELECT Id, Title__c, Date__c, Link__c, Link_Label__c, Slider_Color__c, Category__c
			                    FROM Story__c
			                    WHERE Category__c = :category]){
                //! Each story is wrapped in a Class that hass the formated parameters
				StoryWrap storyWrap = new StoryWrap();
				storyWrap.sectionTitle = st.Title__c;
				storyWrap.label = st.Link_Label__c;
				storyWrap.url = st.Link__c;
                //? I am using the slider color just to demo
				wrap.color = st.Slider_Color__c;
				sections.add(storyWrap);
			}
            //* Add the sections , an Icon (Hardcoded now, but you can add it as a field in the Story)
            wrap.sections= sections;
            wrap.cardIcon= 'utility:notebook';
			toReturn.add(wrap);
		}
		return toReturn;
	}

	private class SectionWrap{
        @AuraEnabled
		public List<StoryWrap> sections;
        @AuraEnabled
		public String headerTitle;
        @AuraEnabled
		public String color;
        @AuraEnabled
		public String cardIcon;
	}

	private class StoryWrap{
        @AuraEnabled
		public String sectionTitle;
        @AuraEnabled
		public String label;
        @AuraEnabled
		public String url;

	}
}