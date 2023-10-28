@isTest
public class SendPayrollSummaryTest{
    @isTest
    static void testBatch(){
        // Create test data
        Contact con = new Contact(FirstName = 'Test', LastName = 'Test', Nickname__c = 'Test', Email = 'test@example.com', npsp__Do_Not_Contact__c = false);
        insert con;
        System.debug('@@ Created Contact: ' + con);

        Term__c term = new Term__c(Name = 'Test Division', Start_Date__c = Date.today(), Short_Name__c = 'test');
        insert term;
        System.debug('@@ Created Term: ' + term);

        Division_Term__c division = new Division_Term__c(Name = 'Test Division', Term__c = term.Id);
        insert division;
        System.debug('@@ Created Division: ' + division);

        Class__c myClass = new Class__c(Name = 'Test Class', Format__c = 'Individual', Start_Date__c = Date.today() - 1, End_Date__c = Date.today() + 1, Division_Term__c = division.Id);
        insert myClass;
        System.debug('@@ Created Class: ' + myClass);

        Participation__c participation = new Participation__c(Contact__c = con.Id, Name = 'Test Participation', Division_Term__c = division.Id);
        insert participation;
        System.debug('@@ Created Participation: ' + participation);

        Enrollment__c enroll = new Enrollment__c(Contact__c = con.Id, Status__c = 'Accepted', Class__c = myClass.Id, Participation__c = participation.Id, Current_Teacher_Email__c = 'test@example.com', Current_Teacher_Name__c = 'Test Teacher');
        insert enroll;
        System.debug('@@ Created Enrollment: ' + enroll);

        // Create an Account (Organization for Affiliation)
        Account org = new Account(Name = 'Test Organization');
        insert org;
        System.debug('@@ Created Organization: ' + org);

        // Create an Affiliation record
        npe5__Affiliation__c affiliation = new npe5__Affiliation__c(npe5__Contact__c = con.Id, npe5__Organization__c = org.Id, npe5__StartDate__c = Date.today().addDays(-10), npe5__EndDate__c = Date.today().addDays(10));
        insert affiliation;
        System.debug('@@ Created Affiliation: ' + affiliation);

        // Create a Program record
        Program__c program = new Program__c(Instrument_Information__c = 'Yes', Interview_Required__c = 'Yes');
        insert program;
        System.debug('@@ Created Program: ' + program);

        // Create an Expenditure record related to Affiliation
        Expenditure__c expenditure = new Expenditure__c(Affiliation__c = affiliation.Id, Division_Term__c = division.Id, Period_Start_Date__c = Date.today().addDays(-5), Period_End_Date__c = Date.today().addDays(5), Program__c = program.Id);
        insert expenditure;
        System.debug('@@ Created Expenditure: ' + expenditure);

        // Start test context
        Test.startTest();

        // Execute the batch job
        ExpenditureEmailBatch batchJob = new ExpenditureEmailBatch();
        Database.executeBatch(batchJob);
        System.debug('@@ Batch Job Executed');

        // Stop test context
        Test.stopTest();
    }

    @isTest
    static void testScheduler(){
        // Start test context
        Test.startTest();

        // Schedule the job
        String cronExp = '0 0 8 1 * ? *';  // Scheduled for 1st of the month at 8 am for testing purpose
        SendPayrollSummaryScheduler schedulerJob = new SendPayrollSummaryScheduler();
        String jobId = System.schedule('Test Scheduled Job', cronExp, schedulerJob);

        // Stop test context
        Test.stopTest();

        // Retrieve the scheduled job's detail
        List<CronTrigger> scheduledJobs = [SELECT Id, CronExpression, TimesTriggered
                                           FROM CronTrigger
                                           WHERE Id = :jobId];

        // Assert that the job has been scheduled
        System.assertEquals(1, scheduledJobs.size(), 'Job was not scheduled properly');
    }

}