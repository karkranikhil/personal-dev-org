/**************************************************************************************************   
Apex Class Name      :  InvoiceGenerationControllerTest
Version              :  1.0                                                                          
Created Date         :  Aug 09, 2021                                                               
Function             :  Test class for InvoiceGenerationController.                                                               
Work Task            :                                                                               
Modification Log     :                                                                           
*--------------------------------------------------------------------------------------------------  
* Developer                   Date                   Description                                     
* ------------------------------------------------------------------------------------------------- 
*/
@isTest
public class InvoiceGenerationControllerTest {

    public static final Id CASH_IN_RECORDTYPEID = Schema.SObjectType.pba_financial__Cash__c.getRecordTypeInfosByDeveloperName().get('Cash_In').getRecordTypeId();
    public static final Id RECEIVABLE_RECORDTYPEID = Schema.SObjectType.pba_financial__Payment__c.getRecordTypeInfosByName().get('Receivable').getRecordTypeId();
    /**
    * Method name  : setUpdate
    * Description  : data required for Test class
    * Return Type  : void
    * Parameter    : null
    **/
    @TestSetup
    public static void setUpData(){
        Contact contact = new contact(FirstName = 'Test',LastName ='Test',Email = 'test@test.com',pba__CompanyName__c = 'Test',LeadSource = 'Web');
        insert contact;
        
        pba_financial__Cash__c objCash = new pba_financial__Cash__c(RecordTypeId = CASH_IN_RECORDTYPEID, pba_financial__Amount__c = 100, pba_financial__Contact__c = contact.Id, pba_financial__Date__c = System.today(),Proyecto__c = 'Blumarina Suites & Plaza');
        insert objCash;
        
        pba__Listing__c objListing = new pba__Listing__c(Name = 'Test',Sale_Price__c = 10000,Payment_Plan_Delivery_Date__c = System.today().addMonths(16), Proyecto__c = 'Cana Rock Condos');
        insert objListing;
        
        pba_financial__Payment__c objPayment = new pba_financial__Payment__c();
        objPayment.RecordTypeId = RECEIVABLE_RECORDTYPEID;
        objPayment.Name = 'MONTO A PAGAR ' + contact.FirstName;
        objPayment.pba_financial__Contact__c = contact.Id;
        objPayment.pba_financial__Total_Amount__c = objListing.Sale_Price__c;
        objPayment.pba_financial__Net_Amount__c = objListing.Sale_Price__c;
        objPayment.pba_financial__Status__c = 'Pending';
        objPayment.Payment_Plan_Type__c = 'Plan de Pago Estandar';
        objPayment.Listing__c = objListing.Id;
        insert objPayment;
        
        pba_financial__Receipt__c objReceipt = new pba_financial__Receipt__c();
        objReceipt.pba_financial__Payment__c = objPayment.Id;
        objReceipt.pba_financial__From_Cash__c = objCash.Id;
        objReceipt.FechadeRecibo__c = SYstem.today();
        objReceipt.pba_financial__Allocated_Amount__c = 100;
        insert objReceipt;
    }
    
    /**
    * Method name  : fetchAllReceiptsToGenerateInvoiceTest
    * Description  : testing functionality of fetchAllReceiptsToGenerateInvoice
    * Return Type  : void
    * Parameter    : null
    **/
    static testmethod void fetchAllReceiptsToGenerateInvoiceTest(){
        pba_financial__Cash__c objFinancialCash = [select id from pba_financial__Cash__c limit 1];
        InvoiceGenerationController.fetchAllReceiptsToGenerateInvoice(objFinancialCash.Id); 
    }
    
    /**
    * Method name  : saveAndEmailInvoiceTest
    * Description  : testing functionality of saveAndEmailInvoice
    * Return Type  : void
    * Parameter    : null
    **/
    static testmethod void saveAndEmailInvoiceTest(){
        pba_financial__Cash__c objFinancialCash = [select id from pba_financial__Cash__c limit 1];
        pba_financial__Receipt__c objReceipt = [select id from pba_financial__Receipt__c limit 1];
        try{
         	InvoiceGenerationController.saveAndEmailInvoice(objFinancialCash.Id,objReceipt.Id);   
        }catch(Exception ex){
            
        }
    }
}