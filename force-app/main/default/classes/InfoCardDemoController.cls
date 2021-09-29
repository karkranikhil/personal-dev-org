public class InfoCardDemoController {
  @AuraEnabled
  public static List<Contact> getContacts() {
    try {
      return [SELECT Id, Name, CreatedDate FROM Contact LIMIT 20];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
  @AuraEnabled
  public static List<Account> getAccounts() {
    try {
      return [SELECT Id, Name, CreatedDate FROM Account LIMIT 5];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
