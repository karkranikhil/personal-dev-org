public with sharing class ReportedHoursReportController{
    public Expenditure__c expenditure{ get;private  set; }

    public List<Occurrence__c> occurrences{ get;private  set; }

    public ReportedHoursReportController(ApexPages.StandardController stdController){
        this.expenditure = [SELECT Id, Affiliation__c, Division_Term__c, Division_Term__r.Name, Program__c, Program__r.Name, Formatted_Pay_Period__c
                            FROM Expenditure__c
                            WHERE Id = :stdController.getId()
                            LIMIT 1];

        this.fetchOccurrences();
    }

    private void fetchOccurrences(){
        occurrences = [SELECT Id, Class__r.Name, Date__c, Individual_Lesson_Status__c
                       FROM Occurrence__c
                       WHERE Affiliation__c = :expenditure.Affiliation__c AND Class__r.Division_Term__c = :expenditure.Division_Term__c AND Class__r.Program__c = :expenditure.Program__c
                       ORDER BY Class__r.Name, Date__c];
        System.debug('@@ Ocurrences' + occurrences);
    }

}