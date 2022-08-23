/**
 * @description       : 
 * @author            : ErickSixto
 * @group             : 
 * @last modified on  : 08-23-2022
 * @last modified by  : ErickSixto
**/
@isTest
public class ListingMapControllerTest {
  @isTest
  public static void getNearbyPropertiesByListingIdTest() {
    Listing__c listing = new Listing__c();
    listing.Address__c = '3345 Bell Street';
    listing.City__c = 'New York';
    listing.State__c = 'New York';
    insert listing;

    Property__c property = new Property__c();

    property.Property_Address__Street__s = '3345 Bell Street';
    property.Property_Address__StateCode__s = 'NY';
    property.Property_Address__City__s = 'New York';
    property.Property_Address__CountryCode__s = 'US';

    insert property;
    List<Property__c> properties = ListingMapController.getNearbyPropertiesByListingId(listing.Id);
    System.assert(properties.size()>0, 'List should be greater than zeros');
  }
}
