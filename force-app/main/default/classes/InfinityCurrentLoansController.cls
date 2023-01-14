/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 01-14-2023
 * @last modified by  : ErickSixto
 **/
public with sharing class InfinityCurrentLoansController {
  @AuraEnabled(cacheable=true)
  public static List<LoanWrapper> getLoans() {
    try {
      List<LoanWrapper> loans = new List<LoanWrapper>();
      List<OTF__c> otfs = [
        SELECT
          Id,
          Borrower__c,
          Security_Address__c,
          Limit__c,
          Lender__r.Name,
          Rate__c,
          LVR__c,
          Expiry_Date__c
        FROM OTF__c
      ];

      if (otfs.isEmpty()) {
        return null;
      }
      for (OTF__c otf : otfs) {
        LoanWrapper wrapper = new LoanWrapper(otf);
        loans.add(wrapper);
      }
      return loans;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
  @AuraEnabled
  public static OTF__c getLoanByRecordId(Id recordId) {
    try {
      List<LoanWrapper> loans = new List<LoanWrapper>();
      List<OTF__c> otfs = [
        SELECT
          Id,
          Borrower__c,
          Security_Address__c,
          Limit__c,
          Lender__r.Name,
          Rate__c,
          LVR__c,
          Expiry_Date__c,
          Drawn__c,
          Term_Mnths__c,
          Rate__c,
          Margin__c
        FROM OTF__c
        WHERE Id = :recordId
      ];

      if (otfs.isEmpty()) {
        return null;
      }

      return otfs[0];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  public class LoanWrapper {
    @AuraEnabled
    public String id { get; set; }
    @AuraEnabled
    public String borrower { get; set; }
    @AuraEnabled
    public String securityProperty { get; set; }
    @AuraEnabled
    public Decimal loanAmount { get; set; }
    @AuraEnabled
    public String lender { get; set; }
    @AuraEnabled
    public String interestRate { get; set; }
    @AuraEnabled
    public Decimal currentLVR { get; set; }
    @AuraEnabled
    public Date expiry { get; set; }

    public LoanWrapper(OTF__c otf) {
      this.id = otf.Id;
      this.borrower = otf?.Borrower__c;
      this.securityProperty = otf?.Security_Address__c;
      this.loanAmount = otf?.Limit__c;
      this.lender = otf.Lender__r.Name;
      this.interestRate = otf?.Rate__c;
      this.currentLVR = otf.LVR__c != null ? otf.LVR__c / 100 : null;
      this.expiry = otf?.Expiry_Date__c;
    }
  }
}
