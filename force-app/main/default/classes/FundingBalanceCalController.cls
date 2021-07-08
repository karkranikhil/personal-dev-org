/**
 * @description       : 
 * @author            : DAnnapareddy@walkerdunlop.com
 * @group             : 
 * @last modified on  : 03-09-2021
 * @last modified by  : DAnnapareddy@walkerdunlop.com
 * Modifications Log 
 * Ver   Date         Author                          Modification
 * 1.0   02-05-2021   DAnnapareddy@walkerdunlop.com   Initial Version
**/
public with sharing class FundingBalanceCalController {
    @AuraEnabled(cacheable=false)
    public static list<ResultColumns> getTableColumns(date inputDate,integer days){
        list<ResultColumns> resultColumns = new list<ResultColumns>();
        try {
            
            ResultColumns resultColumn = new ResultColumns();
            resultColumn.label ='WH Lender';
            resultColumn.fieldName ='resultContact';
            resultColumn.type ='text';
            resultColumns.add(resultColumn);
            for(integer i=1;i<8;i++)
            {
                Date dt= inputDate.addDays(i-1+(days*7));
                ResultColumns resultColumnDays = new ResultColumns();
                resultColumnDays.label =dt.format();
                resultColumnDays.fieldName ='day'+i;
                resultColumnDays.type ='currency';
                TypeAttributes tAtt= new TypeAttributes();
                tAtt.currencyCode='USD';
                resultColumnDays.typeAttributes = tAtt;
                resultColumns.add(resultColumnDays);
            }


            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

        return resultColumns;
    }
    @AuraEnabled(cacheable=false)
    public static List<ResultTable> getRemainingBalance(date inputDate, integer days) {

        String label = System.label.WHLenderCodes;
        List<String> WHLenderCodes = label.split(',');
        system.debug('WHLenderCodes:'+WHLenderCodes);
        if(days==null)
        {
            days=0;
        }
        inputDate=inputDate.addDays(1);
        date inputDateValue= inputDate.addDays(days*7);
        date payOffDateValue= inputDateValue.addDays(7);
        List<account> WHLAccContacts = [SELECT id, name, 
        (SELECT id, name, Funding_Limit__c 
            FROM contacts
            WHERE Expiration_Date__c > :inputDateValue 
            OR Expiration_Date__c = null
        ) 
        FROM account 
        WHERE wd_office_code__c in :WHLenderCodes];


        List<Contact> WHLContacts = new List<Contact>();
        map<id, Contact> WHLContactsMap = new map<id, Contact>();
        for(Account a : WHLAccContacts)
        {
            WHLContacts = a.getSObjects('Contacts'); // get all Contacts for the Account
            for(contact c : WHLContacts){
                WHLContactsMap.put(c.id, c);
            }
        
        }

        list<Funding__c> aggResult = [SELECT Provider__r.name,provider__r.Expiration_Date__c,Funding_Date__c,Payoff_Date__c, Funding_Amount__c ,  Provider__c
        FROM Funding__c 
        WHERE Provider__c IN :WHLContactsMap.keySet()        
        AND Funding_Amount__c >: 0
        AND (Payoff_Date__c >= :inputDateValue  OR Payoff_Date__c = null)];

        system.debug('Input Date:'+ inputDate);
        system.debug('WHLContactsMap'+WHLContactsMap);
        system.debug('aggResult: '+aggResult);
        map<string, Decimal> result = new map<string, Decimal>();

        Map<id, ResultTable> totalsMap = new Map<id, ResultTable>();
        
        for(Funding__c ar :aggResult){
            
            resultTable row = new resultTable();
            row.resultId = ar.Provider__c ;
            row.resultContact = ar.Provider__r.name ;
            row.exp = ar.provider__r.Expiration_Date__c;
            
            //row.day1 =ar.Funding_Amount__c;
            integer fundingCurr;
            if((ar.provider__r.Expiration_Date__c >=inputDateValue || ar.provider__r.Expiration_Date__c == null) && ar.Funding_Date__c <= inputDateValue && (ar.Payoff_Date__c == null || ar.Payoff_Date__c>=inputDateValue) )
            {
                row.day1 =ar.Funding_Amount__c;
            
            if(totalsMap.containsKey(row.resultId))
            {
                row.day1=totalsMap.get(row.resultId).day1+ar.Funding_Amount__c;
            }
            }
            if((ar.provider__r.Expiration_Date__c >=inputDateValue.addDays(1) || ar.provider__r.Expiration_Date__c == null) && ar.Funding_Date__c <= inputDateValue.addDays(1) && (ar.Payoff_Date__c == null || ar.Payoff_Date__c >= inputDateValue.addDays(1)) )
            {
                row.day2 =ar.Funding_Amount__c;
            
            if(totalsMap.containsKey(row.resultId))
            {
                row.day2=totalsMap.get(row.resultId).day2+ar.Funding_Amount__c;
            }
            }
            if( (ar.provider__r.Expiration_Date__c >=inputDateValue.addDays(2) || ar.provider__r.Expiration_Date__c == null)&& ar.Funding_Date__c <= inputDateValue.addDays(2) && (ar.Payoff_Date__c == null || ar.Payoff_Date__c >= inputDateValue.addDays(2)) )
            {
                row.day3 =ar.Funding_Amount__c;
            
            if(totalsMap.containsKey(row.resultId))
            {
                system.debug(totalsMap);
                row.day3=totalsMap.get(row.resultId).day3+ar.Funding_Amount__c;
            }
            }
            if((ar.provider__r.Expiration_Date__c >=inputDateValue.addDays(3) || ar.provider__r.Expiration_Date__c == null) && ar.Funding_Date__c <= inputDateValue.addDays(3) && (ar.Payoff_Date__c == null || ar.Payoff_Date__c >= inputDateValue.addDays(3)) )
            {
                row.day4 =ar.Funding_Amount__c;
            
            if(totalsMap.containsKey(row.resultId))
            {
                row.day4=totalsMap.get(row.resultId).day4+ar.Funding_Amount__c;
            }
            }
            if((ar.provider__r.Expiration_Date__c >=inputDateValue.addDays(4) || ar.provider__r.Expiration_Date__c == null) && ar.Funding_Date__c <= inputDateValue.addDays(4) && (ar.Payoff_Date__c == null || ar.Payoff_Date__c >= inputDateValue.addDays(4)) )
            {
                row.day5 =ar.Funding_Amount__c;
            
            if(totalsMap.containsKey(row.resultId))
            {
                row.day5=totalsMap.get(row.resultId).day5+ar.Funding_Amount__c;
            }
            }
            if((ar.provider__r.Expiration_Date__c >=inputDateValue.addDays(5) || ar.provider__r.Expiration_Date__c == null) && ar.Funding_Date__c <= inputDateValue.addDays(5) && (ar.Payoff_Date__c == null || ar.Payoff_Date__c >= inputDateValue.addDays(5)) )
            {
                row.day6 =ar.Funding_Amount__c;
            
            if(totalsMap.containsKey(row.resultId))
            {
                row.day6=totalsMap.get(row.resultId).day6+ar.Funding_Amount__c;
            }
            }
            if(ar.provider__r.Expiration_Date__c >=inputDateValue.addDays(6) && ar.Funding_Date__c <= inputDateValue.addDays(6) && (ar.Payoff_Date__c == null || ar.Payoff_Date__c >= inputDateValue.addDays(6)) )
            {
                row.day7 =ar.Funding_Amount__c;
            
            if(totalsMap.containsKey(row.resultId))
            {
                row.day7=totalsMap.get(row.resultId).day7+ar.Funding_Amount__c;
            }
            }
            totalsMap.put(row.resultId, row);
        }
        List<ResultTable> rt = new List<ResultTable>();
        for(contact c :WHLContactsMap.values()){
            resultTable rrow = new resultTable();
            rrow.resultId = c.Id;
            rrow.resultContact = c.Name;
            if(totalsMap.get(c.id) != null){
                system.debug(totalsMap.get(c.id));
                if(rrow.exp >= inputDateValue || rrow.exp == null)
                rrow.day1 = c.Funding_Limit__c - totalsMap.get(c.id).day1;
                if(rrow.exp >= inputDateValue.addDays(1) || rrow.exp == null)
                rrow.day2 = c.Funding_Limit__c - totalsMap.get(c.id).day2;
                if(rrow.exp >= inputDateValue.addDays(2) || rrow.exp == null)
                rrow.day3 = c.Funding_Limit__c - totalsMap.get(c.id).day3;
                if(rrow.exp >= inputDateValue.addDays(3) || rrow.exp == null)
                rrow.day4 = c.Funding_Limit__c - totalsMap.get(c.id).day4;
                if(rrow.exp >= inputDateValue.addDays(4) || rrow.exp == null)
                rrow.day5 = c.Funding_Limit__c - totalsMap.get(c.id).day5;
                if(rrow.exp >= inputDateValue.addDays(5) || rrow.exp == null)
                rrow.day6 = c.Funding_Limit__c - totalsMap.get(c.id).day6;
                if(rrow.exp >= inputDateValue.addDays(6) || rrow.exp == null)
                rrow.day7 = c.Funding_Limit__c - totalsMap.get(c.id).day7;
            } else {
                if(rrow.exp >= inputDateValue)
                    rrow.day1 = c.Funding_Limit__c;
                
                if(rrow.exp >= inputDateValue.addDays(1)|| rrow.exp == null)
                rrow.day2 = c.Funding_Limit__c;

                if(rrow.exp >= inputDateValue.addDays(2)|| rrow.exp == null)
                rrow.day3 = c.Funding_Limit__c;

                if(rrow.exp >= inputDateValue.addDays(3)|| rrow.exp == null)
                rrow.day4 = c.Funding_Limit__c;

                if(rrow.exp >= inputDateValue.addDays(4)|| rrow.exp == null)                
                rrow.day5 = c.Funding_Limit__c;

                if(rrow.exp >= inputDateValue.addDays(5)|| rrow.exp == null)
                rrow.day6 = c.Funding_Limit__c;

                if(rrow.exp >= inputDateValue.addDays(6)|| rrow.exp == null)
                rrow.day7 = c.Funding_Limit__c;
            }

            rt.add(rrow);
        }

        system.debug('returning: '+rt);
        return rt;

    }
    public class ResultTable{
        @AuraEnabled
        public String resultContact { get; set; }
        @AuraEnabled
        public Decimal day1 { get; set; } 
        @AuraEnabled
        public Decimal day2 { get; set; } 
        @AuraEnabled
        public Decimal day3 { get; set; } 
        @AuraEnabled
        public Decimal day4 { get; set; } 
        @AuraEnabled
        public Decimal day5 { get; set; } 
        @AuraEnabled
        public Decimal day6 { get; set; } 
        @AuraEnabled
        public Decimal day7 { get; set; } 
        @AuraEnabled
        public String resultId { get; set; }
        @AuraEnabled
        public Date exp { get; set; }        
        public ResultTable(){
            day1=0;
            day2=0;
            day3=0;
            day4=0;
            day5=0;
            day6=0;
            day7=0;

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