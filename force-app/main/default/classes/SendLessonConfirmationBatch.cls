global class SendLessonConfirmationBatch implements Database.Batchable<sObject> {

    global Database.QueryLocator start(Database.BatchableContext BC) {
        
        String query = 'SELECT Id, Name, Contact__c,Individual_Lesson_Confirmation_Emails__c, ' +
                       'Current_Teacher_Name__c, Lessons_Remaining__c, Class__c ' +
                       'FROM Enrollment__c ' +
                       'WHERE Status__c = \'Accepted\' ' +
                       'AND Class__r.Format__c = \'Individual\' ' +
                       'AND Class__r.Class_Status__c = \'Current\' ';
        System.debug('@@ query ' + query);
        return Database.getQueryLocator(query);
    }

    global void execute(Database.BatchableContext BC, List<sObject> scope) {
        System.debug('@@ scope ' + scope);
        OrgWideEmailAddress[] owea = [select Id from OrgWideEmailAddress where Address = 'communityed@crowden.org'];
 
        List<Messaging.SingleEmailMessage> emailsToSend = new List<Messaging.SingleEmailMessage>();
		
        EmailTemplate emailTemplate = [SELECT Id FROM EmailTemplate WHERE DeveloperName = 'Individual_LessonConfirmationVisualforce' LIMIT 1];
		System.debug('@@ emailTemplate ' + emailTemplate.Id);
        for (sObject record : scope) {
            Enrollment__c currentEnrollment = (Enrollment__c) record;

            // Prepare the email addresses
            List<String> toAddresses = currentEnrollment.Individual_Lesson_Confirmation_Emails__c.split(',');
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            email.setTargetObjectId(currentEnrollment.Contact__c);  // Assuming the Contact__c field on Enrollment__c is the recipient
            email.setTemplateId(emailTemplate.Id);
            email.setWhatId(currentEnrollment.Id);
            email.setToAddresses(toAddresses);
            email.setOrgWideEmailAddressId(owea[0].Id);
            email.setSaveAsActivity(true);

            emailsToSend.add(email);
        }
		System.debug('@@ emailsToSend ' + emailsToSend);
        Messaging.sendEmail(emailsToSend);
    }

    global void finish(Database.BatchableContext BC) {
    }
}