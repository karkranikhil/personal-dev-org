@isTest
private class StatementOfAccountControllerTest{
    @isTest
    static void testStatementOfAccountController(){
        //  // Create a test Listing
        pba__Listing__c testListing = new pba__Listing__c(Name = 'Test Listing');
        insert testListing;

        // Create a test contact
        Contact testContact = new Contact(FirstName = 'John', LeadSource='Other', LastName = 'Doe', Email = 'john.doe@example.com', Phone = '1234567890', Listing_Adquirido__c = testListing.Id,  // Use the Id of the test listing
        Idioma_de_Preferencia__c = 'Español');
        insert testContact;

        // Create a test Payment
        pba_financial__Payment__c testPayment = new pba_financial__Payment__c(Name = 'Test Payment', pba_financial__Total_Amount__c=50, Tipo_de_pago__c='Jacuzzi', pba_financial__Contact__c = testContact.Id);
        insert testPayment;

        // Create a test Cash
        pba_financial__Cash__c testCash = new pba_financial__Cash__c(pba_financial__Contact__c = testContact.Id, Tipo_de_cobro__c='Bloqueo',To_Payment__c = testPayment.Id,  pba_financial__Amount__c=25);
        insert testCash;

        // Create a StandardController and set its parameters
        ApexPages.StandardController stdController = new ApexPages.StandardController(testContact);
        ApexPages.currentPage().getParameters().put('contactId', testContact.Id);

        // Instantiate the controller and test its methods
        StatementOfAccountController controller = new StatementOfAccountController();
        System.assertEquals(testContact.Id, controller.contactId);
        System.assertEquals(1, controller.payments.size());
        System.assertEquals(0, controller.nonAssignedCash.size());
        System.assertEquals(true, controller.isSpanish);
        System.assertEquals(false, controller.isEnglish);
        System.assertEquals(1, controller.paymentWithCashAndReceiptsList.size());

        // Test the isValid static method
        Boolean isValid = StatementOfAccountController.isValid(testContact.Id);
        System.assertEquals(true, isValid);
    }
    @isTest
    static void saveAndEmailTest(){
        //  // Create a test Listing
        pba__Listing__c testListing = new pba__Listing__c(Name = 'Test Listing');
        insert testListing;

        // Create a test contact
        Contact testContact = new Contact(FirstName = 'John', LeadSource='Other', LastName = 'Doe', Email = 'john.doe@example.com', Phone = '1234567890', Listing_Adquirido__c = testListing.Id,  // Use the Id of the test listing
        Idioma_de_Preferencia__c = 'Español');
        insert testContact;

        // Create a test Payment
        pba_financial__Payment__c testPayment = new pba_financial__Payment__c(Name = 'Test Payment', pba_financial__Total_Amount__c=50, Tipo_de_pago__c='Jacuzzi', pba_financial__Contact__c = testContact.Id);
        insert testPayment;

        // Create a test Cash
        pba_financial__Cash__c testCash = new pba_financial__Cash__c(pba_financial__Contact__c = testContact.Id, Tipo_de_cobro__c='Bloqueo',To_Payment__c = testPayment.Id,  pba_financial__Amount__c=25);
        insert testCash;

        StatementOfAccountController.saveAndEmail(testContact.Id);

    }
}
