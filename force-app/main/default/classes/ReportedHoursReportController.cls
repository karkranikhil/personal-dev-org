public with sharing class ReportedHoursReportController {
    public Expenditure__c expenditure {get; private set;}
    public List<Occurrence__c> occurrences {get; private set;}
    
    public ReportedHoursReportController(ApexPages.StandardController stdController) {
        try {
            this.expenditure = (Expenditure__c) stdController.getRecord();
            this.fetchOccurrences();
        } catch(Exception e) {
            ApexPages.addMessages(e);
        }
    }
    
    private void fetchOccurrences() {
        try {
            occurrences = [SELECT Id, Class__r.Name, Date__c, Individual_Lesson_Status__c
                           FROM Occurrence__c 
                           WHERE Affiliation__c = :expenditure.Affiliation__c 
                           AND Class__r.Division_Term__c = :expenditure.Division_Term__c
                           AND Program__c = :expenditure.Program__c
                           ORDER BY Class__r.Name, Date__c];
        } catch(Exception e) {
            ApexPages.addMessages(e);
        }
    }
}