public class StatementOfAccountController {
    public String contactId { get; set; }
    public Contact contact { get; set; }
    public List<pba_financial__Payment__c> payments { get; set; }

    public StatementOfAccountController() {
        contactId = ApexPages.currentPage().getParameters().get('contactId');

        if (contactId != null) {
            contact = [SELECT Id, FirstName, LastName, Email, Phone, Listing_Adquirido__c
                       FROM Contact
                       WHERE Id = :contactId];
            payments = [SELECT Id, Name, pba_financial__Total_Amount__c, pba_financial__Balance__c, pba_financial__Status__c, pba_financial__Due_Date__c, CurrencyIsoCode, (SELECT Id, Name, pba_financial__Amount__c, pba_financial__Status__c, Proyecto__c, Late_Payment_Fee__c, pba_financial__Allocated__c, pba_financial__Not_Allocated__c, pba_financial__Date__c, Initial_Payment_Amount__c, To_Payment__c, pba_financial__Contact__c, CurrencyIsoCode
                                                                                                                                                                            FROM Cash__r)
                        FROM pba_financial__Payment__c
                        WHERE pba_financial__Contact__c = :contactId];
        }
    }
}
