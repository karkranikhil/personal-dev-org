public class StatementOfAccountController{
    public String contactId{ get; set; }

    public Contact contact{ get; set; }

    public String project{ get; set; }

    public Boolean isSpanish{ get; set; }

    public Boolean isEnglish{ get; set; }

    public List<pba_financial__Payment__c> payments{ get; set; }

    public StatementOfAccountController(){
        contactId = ApexPages.currentPage().getParameters().get('contactId');

        if (contactId != null){
            contact = [SELECT Id, FirstName, LastName, Email, Phone, Listing_Adquirido__c, Idioma_de_Preferencia__c
                       FROM Contact
                       WHERE Id = :contactId];
            payments = [SELECT Id, Name, Tipo_de_pago__c, pba_financial__Total_Amount__c, pba_financial__Allocated_Cash__c, pba_financial__Balance__c, pba_financial__Status__c, pba_financial__Due_Date__c, CurrencyIsoCode, (SELECT Id, Name, pba_financial__Description__c, pba_financial__Amount__c, pba_financial__Status__c, Proyecto__c, Late_Payment_Fee__c, pba_financial__Allocated__c, pba_financial__Not_Allocated__c, pba_financial__Date__c, Initial_Payment_Amount__c, To_Payment__c, pba_financial__Contact__c, CurrencyIsoCode
                                                                                                                                                                                                                               FROM Cash__r)
                        FROM pba_financial__Payment__c
                        WHERE pba_financial__Contact__c = :contactId];
            project = [SELECT Id, Proyecto__c
                       FROM pba_financial__Cash__c
                       WHERE pba_financial__Contact__c = :contactId
                       ORDER BY CreatedDate DESC
                       LIMIT 1]?.Proyecto__c;
            isSpanish = contact?.Idioma_de_Preferencia__c == 'Español';
            isEnglish = !isSpanish;
        }
    }

    @AuraEnabled
    public static Boolean isValid(Id contactId){
        try{
            List<pba_financial__Payment__c> payments = [SELECT Id
                                                        FROM pba_financial__Payment__c
                                                        WHERE pba_financial__Contact__c = :contactId];
            List<pba_financial__Cash__c> cashs = [SELECT Id
                                                  FROM pba_financial__Cash__c
                                                  WHERE pba_financial__Contact__c = :contactId];
            return !cashs.isEmpty() && !payments.isEmpty();
        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

}