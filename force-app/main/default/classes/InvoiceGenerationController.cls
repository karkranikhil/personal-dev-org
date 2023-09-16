/**************************************************************************************************   
Apex Class Name      :  InvoiceGenerationController
Version              :  1.0                                                                          
Created Date         :  Aug 09, 2021                                                               
Function             :  this class used for handling request from InvoiceGeneration
Work Task            :                                                                               
Modification Log     :        
Test Class Name      :  InvoiceGenerationControllerTest
*--------------------------------------------------------------------------------------------------  
* Developer                   Date                   Description                                     
* ------------------------------------------------------------------------------------------------- 
*/
public without sharing class InvoiceGenerationController {

    public static final String REPLAY_TO_EMAIL = 'cuentasporcobrar@canarock.info';
    public static final String ENGLISH_EMAIL_TEMPLATE_NAME = 'Invoice_EN';
    public static final String SPANISH_EMAIL_TEMPLATE_NAME = 'Invoice_ES';
    
    /**
    * Method name  : fetchAllReceiptsToGenerateInvoice
    * Description  : this method return Receipt record for Generating Invoice from Cash record
    * Return Type  : List<pba_financial__Receipt__c>
    * Parameter    : recordId
    **/
    @AuraEnabled
    public static List<pba_financial__Receipt__c> fetchAllReceiptsToGenerateInvoice(String recordId){
        return [SELECT id,Name,pba_financial__Allocated_Amount__c,pba_financial__Payment__r.Name,FechadeRecibo__c from pba_financial__Receipt__c where pba_financial__From_Cash__c =: recordId];
    }
    
    /**
    * Method name  : saveAndEmailInvoice
    * Description  : this method send Email to contact & save as file under cash 
    * Return Type  : void
    * Parameter    : recordId
    **/
    @AuraEnabled
    public static void saveAndEmailInvoice(String recordId, String receiptId){
        pba_financial__Cash__c objFinancialCash = [SELECT id,pba_financial__Contact__r.Listing_Adquirido__r.Name, To_Payment__c, To_Payment__r.Listing_Adquirido__r.Name, pba_financial__Contact__c,pba_financial__Contact__r.Email,pba_financial__Contact__r.Name,pba_financial__Contact__r.Idioma_de_Preferencia__c
                                                   from pba_financial__Cash__c 
                                                   where Id=: recordId ];
        
        PageReference pdf = Page.InvoicePDF;
        // add parent id to the parameters for standardcontroller
        pdf.getParameters().put('id',receiptId);
        Blob pdfBody = Blob.valueOf('Test content');
        if(!Test.isRunningTest()){
            pdfBody = pdf.getContent();
        }
        
        String fileName = objFinancialCash.pba_financial__Contact__r.Idioma_de_Preferencia__c == 'Español' ? 'Factura : ' : 'Invoice : ';
        fileName += objFinancialCash?.To_Payment__r?.Listing_Adquirido__r?.Name;
        fileName = fileName.trim();
        
        //save as file
        saveAsEnhanceFile(receiptId, objFinancialCash, fileName, pdfBody);
        
        //send Email
        sendEmail(receiptId,objFinancialCash, fileName, pdfBody);
    }
    
    /**
    * Method name  : saveAsEnhanceFile
    * Description  : this method save as file under cash 
    * Return Type  : void
    * Parameter    : objFinancialCash
    **/
    public static void saveAsEnhanceFile(String receiptId, pba_financial__Cash__c objFinancialCash, String fileName, Blob pdfBody){
        PageReference pdf = Page.InvoicePDF;
        // add parent id to the parameters for standardcontroller
        pdf.getParameters().put('id',receiptId);
        
        //Create Document
        ContentVersion cv = new ContentVersion();
        cv.Title = fileName;
        cv.PathOnClient = cv.Title+'.pdf';
        cv.VersionData = pdfBody;
        cv.IsMajorVersion = true;
        Insert cv;
        
        //Get Content Documents
        Id conDocId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:cv.Id].ContentDocumentId;
        
        //Create ContentDocumentLink 
        ContentDocumentLink cdl = New ContentDocumentLink();
        cdl.LinkedEntityId = receiptId;
        cdl.ContentDocumentId = conDocId;
        cdl.shareType = 'V';
        Insert cdl;
        
        //attach to parent as well
        ContentDocumentLink cloneCdl = cdl.clone();
        cloneCdl.Id = null;
        cloneCdl.LinkedEntityId = objFinancialCash.Id;
        insert cloneCdl;
    }
    
    /**
    * Method name  : sendEmail
    * Description  : this method send Email to contact
    * Return Type  : void
    * Parameter    : objFinancialCash
    **/
    public static void sendEmail(String receiptId,pba_financial__Cash__c objFinancialCash, String fileName, Blob pdfBody){
        EmailTemplate objEmailTemplate = [SELECT Id,Subject, Body FROM EmailTemplate WHERE DeveloperName =:ENGLISH_EMAIL_TEMPLATE_NAME];
        if('Español'.equalsIgnoreCase(objFinancialCash.pba_financial__Contact__r.Idioma_de_Preferencia__c)){
            objEmailTemplate = [SELECT Id,Subject, Body FROM EmailTemplate WHERE DeveloperName =:SPANISH_EMAIL_TEMPLATE_NAME];
        }
        
        //Create Email file attachment from document
        Messaging.EmailFileAttachment attach = new Messaging.EmailFileAttachment();
        attach.setFileName(fileName+'.pdf');
        attach.Body = pdfBody;
        
        List<Messaging.SingleEmailMessage> lstSingleEmailMessage = new List<Messaging.SingleEmailMessage>();
        
        OrgWideEmailAddress objOrgWideEmailAddress = [SELECT Id, Address, DisplayName FROM OrgWideEmailAddress where Address =:REPLAY_TO_EMAIL limit 1 ];
        
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new List<String>{objFinancialCash.pba_financial__Contact__r.Email});
        mail.setOrgWideEmailAddressId(objOrgWideEmailAddress.Id);
        mail.setReplyTo(REPLAY_TO_EMAIL);
        mail.setCcAddresses(new List<String>{REPLAY_TO_EMAIL});
        mail.setTemplateId(objEmailTemplate.Id);
        mail.setTargetObjectId(objFinancialCash.pba_financial__Contact__c);
        mail.setWhatId(receiptId);
        mail.setSaveAsActivity(true);
        mail.setUseSignature(false);
        mail.setFileAttachments(new Messaging.EmailFileAttachment[] { attach });//Set File Attachment
        lstSingleEmailMessage.add(mail);
        
        if(!lstSingleEmailMessage.isEmpty()){
            Messaging.SendEmailResult[] results = Messaging.sendEmail(lstSingleEmailMessage);
        }
    }
}