public class StatementOfAccountController{
    public static final String REPLAY_TO_EMAIL = 'cuentasporcobrar@canarock.info';
    public static final String ENGLISH_EMAIL_TEMPLATE_NAME = 'StatementOfAccount_EN';
    public static final String SPANISH_EMAIL_TEMPLATE_NAME = 'StatementOfAccount_ES';
    public String contactId{ get; set; }

    public List<String> paymentIds{ get; set; }

    public Boolean includeReceipts{ get; set; }

    public Contact contact{ get; set; }

    public String project{ get; set; }

    public String listing{ get; set; }

    public Date currentDate{ get; set; }

    public Boolean isSpanish{ get; set; }

    public Boolean isEnglish{ get; set; }

    public List<pba_financial__Payment__c> payments{ get; set; }

    public List<pba_financial__Cash__c> nonAssignedCash{ get; set; }

    public List<PaymentWithCashAndReceipts> paymentWithCashAndReceiptsList{ get; set; }

    public StatementOfAccountController(){
        contactId = ApexPages.currentPage().getParameters().get('contactId');
        String paymentIdsParam = ApexPages.currentPage().getParameters().get('paymentIds');
        String includeReceiptsParam = ApexPages.currentPage().getParameters().get('includeReceipts');

        if (String.isNotBlank(paymentIdsParam)){
            paymentIds = paymentIdsParam.split(',');
        }
        if (String.isNotBlank(includeReceiptsParam)){
            includeReceipts = Boolean.valueOf(includeReceiptsParam);
        }

        currentDate = Date.today();

        if (contactId != null){
            contact = [SELECT Id, FirstName, LastName, Email, Phone, Listing_Adquirido__c, Idioma_de_Preferencia__c
                       FROM Contact
                       WHERE Id = :contactId];

            listing = [SELECT Id, Name
                       FROM pba__Listing__c
                       WHERE Id = :contact.Listing_Adquirido__c]?.Name;

            payments = [SELECT Id, Name, Tipo_de_pago__c, Listing_Adquirido_Name__c, Payment_Type_Translated__c, pba_financial__Total_Amount__c, pba_financial__Allocated_Cash__c, pba_financial__Balance__c, pba_financial__Status__c, pba_financial__Due_Date__c, CurrencyIsoCode, (SELECT Id, Name, Tipo_de_cobro__c, Charge_type_translated__c, pba_financial__Description__c, pba_financial__Amount__c, pba_financial__Status__c, Proyecto__c, Late_Payment_Fee__c, pba_financial__Allocated__c, pba_financial__Not_Allocated__c, pba_financial__Date__c, Initial_Payment_Amount__c, To_Payment__c, pba_financial__Contact__c, CurrencyIsoCode
                                                                                                                                                                                                                                                                                      FROM Cash__r
                                                                                                                                                                                                                                                                                      ORDER BY CreatedDate ASC)
                        FROM pba_financial__Payment__c
                        WHERE Id IN:paymentIds
                        ORDER BY CreatedDate ASC];
            nonAssignedCash = [SELECT Id, Tipo_de_cobro__c, Charge_type_translated__c, Name, pba_financial__Description__c, pba_financial__Amount__c, pba_financial__Status__c, Proyecto__c, Late_Payment_Fee__c, pba_financial__Allocated__c, pba_financial__Not_Allocated__c, pba_financial__Date__c, Initial_Payment_Amount__c, To_Payment__c, pba_financial__Contact__c, CurrencyIsoCode, (SELECT Id, Name, pba_financial__Allocated_Amount__c, CurrencyIsoCode, FechadeRecibo__c
                                                                                                                                                                                                                                                                                                                                                                                               FROM pba_financial__CashAllocation2Cash__r)
                               FROM pba_financial__Cash__c
                               WHERE pba_financial__Contact__c = :contactId AND To_Payment__c = null];
            project = [SELECT Id, Proyecto__c
                       FROM pba_financial__Cash__c
                       WHERE pba_financial__Contact__c = :contactId
                       ORDER BY CreatedDate DESC
                       LIMIT 1]?.Proyecto__c;
            isSpanish = contact?.Idioma_de_Preferencia__c == 'Español';
            isEnglish = !isSpanish;

            paymentWithCashAndReceiptsList = new List<PaymentWithCashAndReceipts>();

            for (pba_financial__Payment__c payment : payments){
                PaymentWithCashAndReceipts paymentWithCashAndReceipts = new PaymentWithCashAndReceipts(payment);
                for (pba_financial__Cash__c cash : payment.Cash__r){
                    CashWithReceipts cashWithReceipts = new CashWithReceipts(cash);
                    if (includeReceipts){
                        cashWithReceipts.receipts = [SELECT Id, Name, pba_financial__Allocated_Amount__c, CurrencyIsoCode, FechadeRecibo__c
                                                     FROM pba_financial__Receipt__c
                                                     WHERE pba_financial__From_Cash__c = :cash.Id
                                                     ORDER BY CreatedDate ASC];
                    }

                    paymentWithCashAndReceipts.cashWithReceiptsList.add(cashWithReceipts);
                }
                paymentWithCashAndReceiptsList.add(paymentWithCashAndReceipts);
            }


        }
    }

    /**
     * Method name  : isValid
     * Description  : Validates if this contact should generate an Statement of Account
     * Return Type  : Boolean
     * Parameter    : contactId
     **/
    @AuraEnabled
    public static Boolean isValid(Id contactId){
        try{
            List<pba_financial__Payment__c> payments = [SELECT Id
                                                        FROM pba_financial__Payment__c
                                                        WHERE pba_financial__Contact__c = :contactId
                                                        ORDER BY CreatedDate ASC];
            List<pba_financial__Cash__c> cashs = [SELECT Id
                                                  FROM pba_financial__Cash__c
                                                  WHERE pba_financial__Contact__c = :contactId
                                                  ORDER BY CreatedDate ASC];
            return !cashs.isEmpty() && !payments.isEmpty();
        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class PaymentWithCashAndReceipts{
        public pba_financial__Payment__c payment{ get; set; }

        public List<CashWithReceipts> cashWithReceiptsList{ get; set; }

        public PaymentWithCashAndReceipts(pba_financial__Payment__c payment){
            this.payment = payment;
            this.cashWithReceiptsList = new List<CashWithReceipts>();
        }

    }

    public class CashWithReceipts{
        public pba_financial__Cash__c cash{ get; set; }

        public List<pba_financial__Receipt__c> receipts{ get; set; }

        public CashWithReceipts(pba_financial__Cash__c cash){
            this.cash = cash;
            this.receipts = new List<pba_financial__Receipt__c>();
        }

    }

    /**
     * Method name  : saveAndEmai
     * Description  : this method send Email to contact & save as file under record
     * Return Type  : void
     * Parameter    : recordId
     **/
    @AuraEnabled
    public static void saveAndEmail(String recordId){
        Contact currentContact = [SELECT Id, Email, Name, Listing_Adquirido__c, Idioma_de_Preferencia__c
                                  FROM Contact
                                  WHERE Id = :recordId];

        String listing = [SELECT Id, Name
                          FROM pba__Listing__c
                          WHERE Id = :currentContact.Listing_Adquirido__c]?.Name;
        PageReference pdf = Page.statementOfAccountPDF;
        // add parent id to the parameters for standardcontroller
        pdf.getParameters().put('contactId', currentContact.Id);
        Blob pdfBody = Blob.valueOf('Test content');
        if (!Test.isRunningTest()){
            pdfBody = pdf.getContent();
        }
        String today = Date.today().format().replace('/', '_');
        String fileName = currentContact.Idioma_de_Preferencia__c == 'Español' ? 'Estado_de_cuenta_' : 'Statement_of_account_';
        fileName += currentContact.Name.replace(' ', '_');
        //fileName += listing.replace(' ', '_');
        fileName += '_' + today;
        fileName = fileName.trim();

        //save as file
        saveAsEnhanceFile(currentContact.Id, fileName, pdfBody);

        //send Email
        sendEmail(currentContact, fileName, pdfBody);
    }

    /**
     * Method name  : saveAsEnhanceFile
     * Description  : this method save as file under contact
     * Return Type  : void
     * Parameter    : contactId
     **/
    public static void saveAsEnhanceFile(String contactId, String fileName, Blob pdfBody){
        PageReference pdf = Page.statementOfAccountPDF;
        // add parent id to the parameters for standardcontroller
        pdf.getParameters().put('contactId', contactId);

        //Create Document
        ContentVersion cv = new ContentVersion();
        cv.Title = fileName;
        cv.PathOnClient = cv.Title + '.pdf';
        cv.VersionData = pdfBody;
        cv.IsMajorVersion = true;
        Insert cv;

        //Get Content Documents
        Id conDocId = [SELECT ContentDocumentId
                       FROM ContentVersion
                       WHERE Id = :cv.Id].ContentDocumentId;

        //Create ContentDocumentLink
        ContentDocumentLink cdl = New ContentDocumentLink();
        cdl.LinkedEntityId = contactId;
        cdl.ContentDocumentId = conDocId;
        cdl.shareType = 'V';
        Insert cdl;
    }

    /**
     * Method name  : sendEmail
     * Description  : this method send Email to contact
     * Return Type  : void
     * Parameter    : con
     **/
    public static void sendEmail(Contact con, String fileName, Blob pdfBody){
        EmailTemplate objEmailTemplate = [SELECT Id, Subject, Body
                                          FROM EmailTemplate
                                          WHERE DeveloperName = :ENGLISH_EMAIL_TEMPLATE_NAME];
        if ('Español'.equalsIgnoreCase(con.Idioma_de_Preferencia__c)){
            objEmailTemplate = [SELECT Id, Subject, Body
                                FROM EmailTemplate
                                WHERE DeveloperName = :SPANISH_EMAIL_TEMPLATE_NAME];
        }

        //Create Email file attachment from document
        Messaging.EmailFileAttachment attach = new Messaging.EmailFileAttachment();
        attach.setFileName(fileName + '.pdf');
        attach.Body = pdfBody;

        List<Messaging.SingleEmailMessage> lstSingleEmailMessage = new List<Messaging.SingleEmailMessage>();

        OrgWideEmailAddress objOrgWideEmailAddress = [SELECT Id, Address, DisplayName
                                                      FROM OrgWideEmailAddress
                                                      where Address = :REPLAY_TO_EMAIL
                                                      limit 1];

        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new List<String>{ con.Email });
        mail.setOrgWideEmailAddressId(objOrgWideEmailAddress.Id);
        mail.setReplyTo(REPLAY_TO_EMAIL);
        // mail.setCcAddresses(new List<String>{ REPLAY_TO_EMAIL });
        mail.setTemplateId(objEmailTemplate.Id);
        mail.setTargetObjectId(con.Id);
        mail.setSaveAsActivity(true);
        mail.setUseSignature(false);
        mail.setFileAttachments(new Messaging.EmailFileAttachment[]{ attach });//Set File Attachment
        lstSingleEmailMessage.add(mail);

        if (!lstSingleEmailMessage.isEmpty()){
            Messaging.SendEmailResult[] results = Messaging.sendEmail(lstSingleEmailMessage);
        }
    }

    // Apex Controller - Additional Method to Fetch Payments
    @AuraEnabled
    public static List<pba_financial__Payment__c> fetchPaymentsByContact(Id contactId){
        return [SELECT Id, Name, Listing_Adquirido_Name__c, pba_financial__Total_Amount__c
                FROM pba_financial__Payment__c
                WHERE pba_financial__Contact__c = :contactId];
    }

}