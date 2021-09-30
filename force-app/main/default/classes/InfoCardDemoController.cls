public class InfoCardDemoController {
  @AuraEnabled
  public static List<Contact> getContacts() {
    try {
      return [SELECT Id, Name, CreatedDate FROM Contact ORDER BY CreatedDate DESC LIMIT 20 ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
  @AuraEnabled
  public static List<Account> getAccounts() {
    try {
      return [SELECT Id, Name, CreatedDate FROM Account  ORDER BY CreatedDate DESC LIMIT 5];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
