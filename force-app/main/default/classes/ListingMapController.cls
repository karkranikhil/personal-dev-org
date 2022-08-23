/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 08-23-2022
 * @last modified by  : ErickSixto
 **/
public with sharing class ListingMapController {
  @AuraEnabled
  public static List<Property__c> getNearbyPropertiesByListingId(Id recordId) {
    try {
      List<Listing__c> listings = [
        SELECT Id, Address__c, City__c, State__c, State_Code__c
        FROM Listing__c
        WHERE Id = :recordId
      ];
      if (listings.size() == 0) {
        return null;
      }
      String city = listings[0]?.City__c;
      String stateCode = listings[0]?.State_Code__c;

      if (city == null || stateCode == null) {
        return null;
      }
      city = city.trim();
      stateCode = stateCode.trim();
      List<Property__c> properties = [
        SELECT
          Id,
          Name,
          Property_Code_APN__c,
          Property_Address__Street__s,
          Property_Address__StateCode__s,
          Property_Address__City__s,
          Property_Address__PostalCode__s
        FROM Property__c
        WHERE
          Property_Address__City__s = :city
          AND Property_Address__StateCode__s = :stateCode
      ];
      if (properties.size() == 0) {
        return null;
      }
      return properties;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
