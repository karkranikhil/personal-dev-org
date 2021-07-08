/**
 * @description       : 
 * @author            : DAnnapareddy@walkerdunlop.com
 * @group             : 
 * @last modified on  : 03-09-2021
 * @last modified by  : DAnnapareddy@walkerdunlop.com
 * Modifications Log 
 * Ver   Date         Author                          Modification
 * 1.0   03-05-2021   DAnnapareddy@walkerdunlop.com   Initial Version
**/
public with sharing class FundingBalanceNDays {
    @AuraEnabled(cacheable=false)
    public static list<ResultColumns> getTableColumns(date inputDate,integer days){
        list<ResultColumns> resultColumns = new list<ResultColumns>();
        try {    
            String label = System.label.WHLenderCodes;
        ResultTable rt = new ResultTable();
        List<String> wHLenderCodes = label.split(',');        
            //ResultColumns resultColumn = new ResultColumns();
            ResultColumns resultColumnDate = new ResultColumns();
            resultColumnDate.label ='Date';
            resultColumnDate.fieldName ='Date';
            resultColumnDate.type ='date';
            resultColumns.add(resultColumnDate);
            
            List<account> wHLAccContacts = [SELECT id, name, 
            (SELECT id, name, Funding_Limit__c 
                FROM contacts                
            ) 
            FROM account 
            WHERE wd_office_code__c in :wHLenderCodes];

            for(account acc:wHLAccContacts)
            {
                for(contact con:acc.getSObjects('Contacts'))
                {
                    ResultColumns resultColumnDays = new ResultColumns();
                    resultColumnDays.label =con.Name;
                    resultColumnDays.fieldName =con.id;
                    resultColumnDays.type ='currency';
                    TypeAttributes tAtt= new TypeAttributes();
                    tAtt.currencyCode='USD';
                    resultColumnDays.typeAttributes = tAtt;
                    resultColumns.add(resultColumnDays);
                }
            }


            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

        return resultColumns;
    }
    @AuraEnabled(cacheable=false)
    public static list<Map<string,object>> getRemainingBalance(date inputDate, integer days, integer noOfDays) {

        String label = System.label.WHLenderCodes;
        ResultTable rt = new ResultTable();
        List<String> wHLenderCodes = label.split(',');
        system.debug('WHLenderCodes:'+wHLenderCodes);
        if(days==null)
        {
            days=0;
        }
        if(noOfDays == null || noOfDays < 1)
        {
            noOfDays=30;
        }
        inputDate=inputDate.addDays(1);
        Date inputDateValue= inputDate.addDays(days*noOfDays);
        Date payOffDateValue= inputDate.addDays(noOfDays);
        List<account> wHLAccContacts = [SELECT id, name, 
        (SELECT id, name, Funding_Limit__c,Expiration_Date__c
            FROM contacts
            WHERE Expiration_Date__c > :inputDateValue 
            OR Expiration_Date__c = null
        ) 
        FROM account 
        WHERE wd_office_code__c in :wHLenderCodes];


        List<Contact> wHLContacts = new List<Contact>();
        map<id, Contact> wHLContactsMap = new map<id, Contact>();
        for(Account a : wHLAccContacts)
        {
            wHLContacts = a.getSObjects('Contacts'); // get all Contacts for the Account
            for(contact c : wHLContacts){
                wHLContactsMap.put(c.id, c);
            }
        
        }
        Map<Id,Contact> contact_Funding = new Map<Id,Contact>([select Id ,(SELECT Provider__r.name,provider__r.Expiration_Date__c,Funding_Date__c,Payoff_Date__c, Funding_Amount__c ,  Provider__c
        FROM Fundings__r 
        WHERE  Funding_Amount__c >: 0
        AND (Payoff_Date__c >= :inputDateValue  OR Payoff_Date__c = null) ) from contact where Id IN:wHLContactsMap.keySet()]);

        for(integer i=0;i<30;i++)
        {
            date inputDateRow = inputDateValue.addDays(i);
            Map<string,object> dateRow = new Map<string,object>();
            dateRow.put('Date',inputDateRow);
           

            for(contact c : wHLContactsMap.values()){
                contact contactRecord= contact_Funding.get(c.Id);
                decimal fundedAmount=0;
               for(Funding__c fundingRecord:contactRecord.getSObjects('Fundings__r'))
               {
                   if(fundingRecord.Payoff_Date__c== null || fundingRecord.Payoff_Date__c>=inputDateRow)
                   {
                    fundedAmount = fundedAmount+fundingRecord.Funding_Amount__c;
                   }
               }
               decimal fundingLimit = c.Funding_Limit__c;
               if(c.Expiration_Date__c < inputDateRow)
               {
                fundingLimit=0;
                fundedAmount=0;

               }
                
               dateRow.put(c.Id,fundingLimit-fundedAmount);
               dateRow.put('resultId',c.Id);
               
            }
            rt.mapValues.put(inputDateRow,dateRow);
        }


        return rt.MapValues.values();

    }
    public class ResultTable{        
        @AuraEnabled
        public Map<Date,Map<string,object>> mapValues;
        public ResultTable(){
            mapValues = new Map<Date,Map<string,object>>(); 
        }
    }
    public class ResultColumns{
        @AuraEnabled
        public String label{ get; set;}
        @AuraEnabled
        public String fieldName{ get; set;}
        @AuraEnabled
        public String type{ get; set;}
        @AuraEnabled
        public TypeAttributes typeAttributes{ get;set;}
    }
    public class TypeAttributes{
        @AuraEnabled
        public String currencyCode{ get; set;}
    }
}