@isTest
public class SendLessonConfirmationTest{
    @isTest
    static void testBatch() {
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

        Class__c myClass = new Class__c(Name = 'Test Class', Format__c = 'Individual', Start_Date__c = Date.today()-1, End_Date__c = Date.today() + 1, Division_Term__c = division.Id);
        insert myClass;
        System.debug('@@ Created Class: ' + myClass);

        Participation__c participation = new Participation__c(Contact__c = con.Id, Name = 'Test Participation', Division_Term__c = division.Id);
        insert participation;
        System.debug('@@ Created Participation: ' + participation);

        Enrollment__c enroll = new Enrollment__c(Contact__c = con.Id, Status__c = 'Accepted', Class__c = myClass.Id, Participation__c = participation.Id, Current_Teacher_Email__c = 'test@example.com', Current_Teacher_Name__c = 'Test Teacher');
        insert enroll;
        System.debug('@@ Created Enrollment: ' + enroll);

        // Start test context
        Test.startTest();

        // Run the batch job
        SendLessonConfirmationBatch batch = new SendLessonConfirmationBatch();
        Database.executeBatch(batch);
        System.debug('@@ Batch Job Executed');

        // Stop test context
        Test.stopTest();

        // Query for the Enrollments to check if emails were sent
        List<Enrollment__c> updatedEnrollments = [SELECT Id, Name, Individual_Lesson_Confirmation_Emails__c FROM Enrollment__c];
        System.debug('@@ updatedEnrollments: ' + updatedEnrollments);
    }

    @isTest
    static void testScheduler(){
        // Start test context
        Test.startTest();

        // Schedule the job
        String cronExp = '0 0 10 * * ?';
        SendLessonConfirmationScheduler scheduler = new SendLessonConfirmationScheduler();
        String jobId = System.schedule('Test Scheduled Job', cronExp, scheduler);

        // Stop test context
        Test.stopTest();

        // Get the scheduled job's detail
        List<CronTrigger> scheduledJobs = [SELECT Id, CronExpression, TimesTriggered
                                           FROM CronTrigger
                                           WHERE Id = :jobId];

        // Assert that the job has been scheduled
        System.assertEquals(1, scheduledJobs.size(), 'Job was not scheduled properly');

        // Get the scheduled job's detail
        CronTrigger scheduledJob = scheduledJobs[0];

        // Debugging: Print actual cron expression and times triggered
        System.debug('Actual Cron Expression: ' + scheduledJob.CronExpression);
        System.debug('Times Triggered: ' + scheduledJob.TimesTriggered);

        // Assert that the job has not run yet
        System.assertEquals(0, scheduledJob.TimesTriggered, 'Job should not have been triggered yet');
    }

}