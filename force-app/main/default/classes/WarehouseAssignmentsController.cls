/**
 * @description       : Warehouse Projections report
 * @author            : ssuddula@walkerdunlop.com
**/
public with sharing class WarehouseAssignmentsController {

    @AuraEnabled(cacheable=true)
    public static List<ResultTable> getFundings() 
    {
        Date todaysDate = System.today();
         Date WeekFrom = todaysDate.toStartofWeek();
         Date WeekTo = WeekFrom.adddays(6);
        List<ResultTable> rt = new List<ResultTable>();
        Set<Id> setOppId = new Set<Id>();
        Set<Id> setRecordTypeId = new Set<Id>();
        Map<Id,Id> mapOppCloser = new Map<Id,Id>();
        Map<Id,String> mapOppExternalRole = new Map<Id,String>();
        Map<Id,String> mapOppUserName = new Map<Id,String>();
        Map<Id,String> mapRT = new Map<Id,String>();
        List<String> lstOppStage = new List<String>();
        lstOppStage.add('Signed Contract');
        lstOppStage.add('Approved by Credit');
        lstOppStage.add('Executed Commitment');
        lstOppStage.add('Rate Locked');
        lstOppStage.add('Closed Won');
        lstOppStage.add('Closed Lost');

        List<String> lstOppRecType = new List<String>();
        lstOppRecType.add('FNM');
        lstOppRecType.add('HUD');
        lstOppRecType.add('FRE');
        List<Id> lstRecTypeId = new List<Id>();

        for(RecordType objRT : [Select Id,DeveloperName,SobjectType from RecordType where DeveloperName IN :lstOppRecType AND SobjectType ='Opportunity'])
        {
            lstRecTypeId.add(objRT.Id);
        }
       
        /*List<Funding__c> lstFunding = [SELECT Id,Opportunity__c,Opportunity__r.Name,Opportunity__r.Rate_Lock_Actual__c,Funding_Amount__c,Opportunity__r.Amount,
                                Opportunity__r.BED_Purchase_Date__c,Opportunity__r.Purpose__c,Opportunity__r.Coupon_Rate__c,Opportunity__r.Id,Opportunity__r.Warehouse_Confirmed__c,Opportunity__r.Field_Event__c,
                                Opportunity__r.StageName,Opportunity__r.WD_App_Contract_Date__c,Opportunity__r.RecordTypeId,Funding_Date__c,Payoff_Date__c,Provider__c,Provider__r.Name FROM Funding__c
                                WHERE Opportunity__r.WD_App_Contract_Date__c >= :WeekFrom AND Opportunity__r.WD_App_Contract_Date__c <= :WeekTo];*/

        List<Funding__c> lstFunding = [SELECT Id,Opportunity__c,Opportunity__r.Name,Opportunity__r.Rate_Lock_Actual__c,Funding_Amount__c,Opportunity__r.Amount,Opportunity__r.Close_Actual__c,
                                Opportunity__r.BED_Purchase_Date__c,Opportunity__r.Purpose__c,Opportunity__r.Coupon_Rate__c,Opportunity__r.Id,Opportunity__r.Warehouse_Confirmed__c,Stop_Stamping_FD__c,Opportunity__r.Field_Event__c,
                                Opportunity__r.StageName,Opportunity__r.WD_App_Contract_Date__c,Opportunity__r.RecordTypeId,Funding_Date__c,Payoff_Date__c,Provider__c,Provider__r.Name FROM Funding__c
                                WHERE Opportunity__r.Field_Event__c != null AND Opportunity__r.Warehouse_Confirmed__c = false AND Opportunity__r.Purpose__c != 'Assumption'
                                AND Opportunity__r.StageName IN :lstOppStage AND Opportunity__r.RecordTypeId IN :lstRecTypeId];  
        
        system.debug('lstFunding '+lstFunding.size());
        for(Funding__c objFun: lstFunding)
        {
            setOppId.add(objFun.Opportunity__r.Id);
            setRecordTypeId.add(objFun.Opportunity__r.RecordTypeId);
        }

        for(OpportunityTeamMember objMember : [Select OpportunityId,UserId,TeamMemberRole from OpportunityTeamMember where TeamMemberRole = 'Closer' and OpportunityId IN :setOppId])
        {
            mapOppCloser.put(objMember.UserId,objMember.OpportunityId);
        }
        for(User objUser : [Select Id,Name from User where Id IN :mapOppCloser.keySet()])
        {
            mapOppUserName.put(mapOppCloser.get(objUser.Id),objUser.Name);
        }
        for(Opportunity_Role__c objRole : [Select External_Role_Type__c,Company_Name__c,Company_Name__r.Name,Opportunity__c from Opportunity_Role__c where External_Role_Type__c = 'Trade Desk Investor' and Opportunity__c IN :setOppId])
        {
            mapOppExternalRole.put(objRole.Opportunity__c,objRole.Company_Name__r.Name);
        }
        for(RecordType objRT : [Select Id,Name from RecordType where Id IN :setRecordTypeId])
        {
            mapRT.put(objRT.Id,objRT.Name);
        }

        for(Funding__c objFun: lstFunding)
        {
            resultTable rrow = new resultTable();
            rrow.resultId = objFun.Id;
            rrow.opportunityName = objFun.Opportunity__r.Name;
            rrow.opportunityStage = objFun.Opportunity__r.StageName;
            rrow.opportunityRecordType = objFun.Opportunity__r.RecordTypeId;
            rrow.provider = objFun.Provider__r.Name;
            rrow.rateLockedDate = objFun.Opportunity__r.Rate_Lock_Actual__c;
            rrow.wdAppContractDate = objFun.Opportunity__r.WD_App_Contract_Date__c;
            rrow.fundingDate = objFun.Funding_Date__c;
            rrow.payoffDate = objFun.Payoff_Date__c;
            rrow.loanType = mapRT.get(objFun.Opportunity__r.RecordTypeId);


            rrow.fundingAmount = objFun.Funding_Amount__c;
            rrow.loanAmount = objFun.Opportunity__r.Amount;
            rrow.deliveryDate = objFun.Opportunity__r.BED_Purchase_Date__c;
            rrow.closeDate = objFun.Opportunity__r.Close_Actual__c;
            rrow.purpose = objFun.Opportunity__r.Purpose__c;
            //Double couponRate = objFun.Opportunity__r.Coupon_Rate__c;
            //Double rate =  couponRate/100;
           // rrow.passThrough = rate;
           system.debug('coupon rate '+objFun.Opportunity__r.Coupon_Rate__c);
            if(objFun.Opportunity__r.Coupon_Rate__c != null)
            {
                rrow.passThrough = (objFun.Opportunity__r.Coupon_Rate__c)/100;
                system.debug(' rrow.passThrough '+ rrow.passThrough);
            }
            rrow.tradeDesk = mapOppExternalRole.get(objFun.Opportunity__c);
            rrow.closer = mapOppUserName.get(objFun.Opportunity__c);
            rrow.reviewed = objFun.Opportunity__r.Warehouse_Confirmed__c;
            rrow.confirmed = objFun.Stop_Stamping_FD__c;
            rrow.fieldevent = objFun.Opportunity__r.Field_Event__c;
            rrow.nameUrl = '/'+objFun.Opportunity__c;

            rt.add(rrow);
        }
        return rt;
    }

    @AuraEnabled
public static string updateFunding(Object data) {
    try{
    List<ResultTable> lstResult = (List<ResultTable>) JSON.deserialize(
         JSON.serialize(data),
         List<ResultTable>.class
    );
    List<Funding__c> lstUpdateFund = new List<Funding__c>();
    List<Opportunity> lstUpdateOpp = new List<Opportunity>();
    List<Id> lstFundId = new List<Id>();
    Map<Id,Id> mapOppFund = new Map<Id,Id>();
    Map<Id,Id> mapContactFund = new Map<Id,Id>();
    Map<String,Id> MapFundProvider = new Map<String,Id>();
    for(ResultTable objResult : lstResult) 
    {
        if(objResult.resultId != null)
            lstFundId.add(objResult.resultId);

        if(objResult.provider!=null)
            MapFundProvider.put(objResult.provider,objResult.resultId);
    }
    for(Funding__c objFund : [Select Id,Opportunity__c from Funding__c where Id IN:lstFundId])
    {
        mapOppFund.put(objFund.Id,objFund.Opportunity__c);
    }
    for(Contact objCnt : [Select Id,Name from Contact where Name IN :MapFundProvider.keySet()])
    {
        mapContactFund.put(MapFundProvider.get(objCnt.Name),objCnt.Id);
    }
    for(ResultTable objResult : lstResult) 
    {
        Funding__c objFund = new Funding__c();
        system.debug('objResult.resultId '+objResult.resultId);
        objFund.Id = objResult.resultId;
        Opportunity objOpp = new Opportunity();
        objOpp.Id = mapOppFund.get(objFund.Id);
        if(objResult.payoffDate != null)
        {
            objFund.Payoff_Date__c = objResult.payoffDate;       
        }
        if(objResult.fundingDate != null)
        {
            objFund.Funding_Date__c = objResult.fundingDate;           
        }
        if(objResult.deliveryDate != null)
        {
            objOpp.BED_Purchase_Date__c = objResult.deliveryDate;
            
        }
        if(objResult.provider != null)
        {
            objFund.Provider__c = mapContactFund.get(objFund.Id);
        }
        if(objResult.confirmed != null)
        {
            objFund.Stop_Stamping_FD__c = objResult.confirmed;
        }
        if(objResult.reviewed != null)
        {
            objOpp.Warehouse_Confirmed__c = objResult.reviewed;
        }
        lstUpdateFund.add(objFund);
        lstUpdateOpp.add(objOpp);
    }
    system.debug('lstResult '+lstResult);
    system.debug('lstUpdateFund '+lstUpdateFund);
    if(!lstUpdateFund.isEmpty())   
    { 
        update lstUpdateFund;
    }
    if(!lstUpdateOpp.isEmpty()) 
    {
        update lstUpdateOpp;
    }
        return 'Success: Records updated successfully';
    }
    catch (Exception e) {
        return 'The following exception has occurred: ' + e.getMessage();
    }}

    public class ResultTable
    {
        @AuraEnabled
        public String opportunityName { get; set; }
        @AuraEnabled
        public String opportunityStage { get; set; }
        @AuraEnabled
        public String opportunityRecordType { get; set; }
        @AuraEnabled
        public String provider { get; set; }        
        @AuraEnabled
        public Date rateLockedDate { get; set; } 
        @AuraEnabled
        public Date closeDate { get; set; } 
        @AuraEnabled
        public Date wdAppContractDate { get; set; } 
        @AuraEnabled
        public Date fundingDate { get; set; }
        @AuraEnabled
        public Date payoffDate { get; set; }
        @AuraEnabled
        public String loanType { get; set; }
        @AuraEnabled
        public String resultId { get; set; }

        @AuraEnabled
        public String nameUrl {get;set;}
        @AuraEnabled
        public Double fundingAmount { get; set; }
        @AuraEnabled
        public Double loanAmount { get; set; }
        @AuraEnabled
        public Date deliveryDate { get; set; }
        @AuraEnabled
        public String purpose { get; set; }
        @AuraEnabled
        public Double passThrough { get; set; }
        @AuraEnabled
        public String tradeDesk { get; set; }
        @AuraEnabled
        public String closer { get; set; }
        @AuraEnabled
        public String fieldevent { get; set; }
        @AuraEnabled
        public Boolean confirmed { get; set; }
        @AuraEnabled
        public Boolean reviewed { get; set; }
    }
}