/**
 * ExpenditureEmailBatch Class
 *
 * This batch Apex class is designed to automate the process of sending email notifications
 * related to Expenditure__c records. On execution, it filters and processes Expenditure__c
 * records based on their End_Date__c being equal to YESTERDAY.
 *
 * Key functionalities include:
 * - Querying relevant Expenditure__c records.
 * - Preparing email messages using the "Upcoming_Payroll_Summary" template and sending them
 *   to the associated contacts via the org-wide email address "communityed@crowden.org".
 * - Upon completion, sending a summary email to "stornow@crowden.org" detailing the number
 *   of records processed and the number of errors encountered, if any.
 *
 * Always ensure the existence of the specified email template and org-wide email address
 * before executing this batch job.
 *
 * Developed by: ErickSixto
 * Date:  10-28-2023
 * Last Modified:  11-01-2023
 */
global class ExpenditureEmailBatch implements Database.Batchable<sObject>, Database.Stateful{
    // Global counters for emails sent and failures
    global Integer totalEmailsSent = 0;
    global Integer totalFailures = 0;
    global Database.QueryLocator start(Database.BatchableContext BC){
        String query = 'SELECT Id, Formatted_Pay_Period__c,Affiliation__r.npe5__Contact__c FROM Expenditure__c  WHERE Period_End_Date__c = YESTERDAY'; // Adjust the WHERE clause as necessary: WHERE End_Date__c = YESTERDAY
        return Database.getQueryLocator(query);
    }

    global void execute(Database.BatchableContext BC, List<sObject> scope){
        List<Messaging.SingleEmailMessage> emailsToSend = prepareEmails(scope);
        if (emailsToSend.size() > 0){
            try{
                Messaging.sendEmail(emailsToSend);
                totalEmailsSent += emailsToSend.size();
            } catch (Exception e){
                totalFailures += emailsToSend.size();
            }
        }
    }

    private List<Messaging.SingleEmailMessage> prepareEmails(List<sObject> scope){
        List<Messaging.SingleEmailMessage> emailsToSend = new List<Messaging.SingleEmailMessage>();
        OrgWideEmailAddress[] owea = [SELECT Id
                                      FROM OrgWideEmailAddress
                                      WHERE Address = 'communityed@crowden.org'
                                      LIMIT 1];
        EmailTemplate emailTemplate = [SELECT Id
                                       FROM EmailTemplate
                                       WHERE Name = 'Upcoming Payroll Summary'
                                       LIMIT 1];

        // Check if necessary resources are found
        if (owea.size() == 0 || emailTemplate == null){
            // Handle error: increase totalFailures counter
            totalFailures += scope.size();
            return emailsToSend;
        }

        for (sObject record : scope){
            Expenditure__c currentExpenditure = (Expenditure__c) record;

            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            email.setOrgWideEmailAddressId(owea[0].Id);
            email.setTargetObjectId(currentExpenditure.Affiliation__r.npe5__Contact__c);
            email.setTemplateId(emailTemplate.Id);
            email.setWhatId(currentExpenditure.Id);
            email.setSaveAsActivity(true);

            // Generate the PDF content and add as attachment
            PageReference pdfPage = Page.ReportedHoursReport;
            pdfPage.getParameters().put('id', currentExpenditure.Id);
            Blob pdfBlob;
            if (!Test.isRunningTest()){
                pdfBlob = pdfPage.getContentAsPDF();
            } else{
                pdfBlob = Blob.valueOf('Test PDF Content');  // Mocked content
            }

            Messaging.EmailFileAttachment attachment = new Messaging.EmailFileAttachment();
            attachment.setFileName('ReportedHours-' + currentExpenditure.Formatted_Pay_Period__c + '.pdf');
            attachment.setBody(pdfBlob);
            email.setFileAttachments(new List<Messaging.EmailFileAttachment>{ attachment });

            emailsToSend.add(email);
        }

        return emailsToSend;
    }

    global void finish(Database.BatchableContext BC){
        OrgWideEmailAddress[] owea = [SELECT Id
                                      FROM OrgWideEmailAddress
                                      WHERE Address = 'communityed@crowden.org'
                                      LIMIT 1];

        // Prepare summary email
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setOrgWideEmailAddressId(owea[0].Id);
        email.setToAddresses(new List<String>{ 'communityed@crowden.org' });

        // HTML body for the email
        String emailBody = '<h2>Batch Process Summary for Upcoming Payroll</h2>';
        emailBody += '<p>Date: ' + DateTime.now().format() + '</p>';
        emailBody += '<p>Objective: Upcoming Payroll Summary</p>';
        emailBody += '<p>Total emails sent: <strong>' + totalEmailsSent + '</strong></p>';
        emailBody += '<p>Total failures: <span style="color:red;">' + totalFailures + '</span></p>';

        email.setHtmlBody(emailBody);
        email.setSubject('Batch Process Summary for Upcoming Payroll');

        // Send summary email
        Messaging.sendEmail(new Messaging.SingleEmailMessage[]{ email });
    }

}