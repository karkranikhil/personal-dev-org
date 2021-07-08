public with sharing class FundingBalanceRemainingController {
    @AuraEnabled(cacheable=false)
    public static List<ResultTable> getRemainingBalance(date inputDate) {
        system.debug('inputDate '+inputDate);
        String label = System.label.WHLenderCodes;
        List<String> WHLenderCodes = label.split(',');
        system.debug('WHLenderCodes:'+WHLenderCodes);

        List<account> WHLAccContacts = [SELECT id, name, 
        (SELECT id, name, Funding_Limit__c, Investor_Restriction_Details__c 
            FROM contacts
            WHERE Expiration_Date__c > :inputDate 
            OR Expiration_Date__c = null
        ) 
        FROM account 
        WHERE wd_office_code__c in :WHLenderCodes];


        List<Contact> WHLContacts = new List<Contact>();
        map<id, Contact> WHLContactsMap = new map<id, Contact>();
        for(Account a : WHLAccContacts)
        {
            WHLContacts = a.getSObjects('Contacts'); // get all Contacts for the Account
            if(WHLContacts !=null){
              	for(contact c : WHLContacts){
                	WHLContactsMap.put(c.id, c);
            	} 
            }
            
        
        }

        list<AggregateResult> aggResult = [SELECT Provider__r.name rname,  SUM(Funding_Amount__c) rtotal,  Provider__c rprov
        FROM Funding__c 
        WHERE Provider__c IN :WHLContactsMap.keySet()
        
        AND (Payoff_Date__c >= :inputDate OR Payoff_Date__c = null)
        group by Provider__r.name, Provider__c];

        system.debug('Input Date:'+ inputDate);
        system.debug('WHLContactsMap'+WHLContactsMap);
        system.debug('aggResult: '+aggResult);
        map<string, Decimal> result = new map<string, Decimal>();

        Map<id, ResultTable> totalsMap = new Map<id, ResultTable>();
        
        for(AggregateResult ar :aggResult){
            
            resultTable row = new resultTable();
            row.resultId = string.valueOf(ar.get('rprov')) ;
            row.resultContact = string.valueOf(ar.get('rname')) ;
            row.resultBalance = integer.valueof(ar.get('rtotal'));
            totalsMap.put(row.resultId, row);
        }
        List<ResultTable> rt = new List<ResultTable>();
        for(contact c :WHLContactsMap.values()){
            resultTable rrow = new resultTable();
            rrow.resultId = c.Id;
            rrow.resultContact = c.Name;
            rrow.resultInvestorRestrictionDetails = c.Investor_Restriction_Details__c;
            if(totalsMap.get(c.id) != null){
                rrow.resultBalance = c.Funding_Limit__c - totalsMap.get(c.id).resultBalance;
            } else {
                rrow.resultBalance = c.Funding_Limit__c;
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
        public String resultInvestorRestrictionDetails { get; set; }        
        @AuraEnabled
        public Decimal resultBalance { get; set; } 
        @AuraEnabled
        public String resultId { get; set; }
    }
}