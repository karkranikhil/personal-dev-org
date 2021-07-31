public with sharing class accountDatatableController {
  @AuraEnabled(cacheable=true)
  public static List<DataTableWrapper> getAccountList() {
    List<Account> listAcc = [
      SELECT
        Id,
        Name,
        Type,
        Rating,
        Phone,
        Website,
        AnnualRevenue,
        Mass_Times__c
      FROM Account
      LIMIT 10
    ];

    List<DataTableWrapper> response = new List<DataTableWrapper>();
    for (Account acc : listAcc) {
      DataTableWrapper obj = new DataTableWrapper();
      obj.Id = acc.Id;
      obj.idUrl = '/account/' + acc.Id;
      obj.name = acc.Name;
      obj.Type = acc.Type;
      obj.MassTimes = acc.Mass_Times__c;
      response.add(obj);
    }

    return response;
  }

  private class DataTableWrapper {
    @AuraEnabled
    public Id Id { get; set; }
    @AuraEnabled
    public String name { get; set; }
    @AuraEnabled
    public String idUrl { get; set; }
    @AuraEnabled
    public String Type { get; set; }
    @AuraEnabled
    public String MassTimes { get; set; }
  }
}
