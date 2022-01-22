/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 01-21-2022
 * @last modified by  : ErickSixto
 **/
public with sharing class esLookupController {
  //* ---------------------------- VARIABLES ------------------------------------------------//
  private final static Integer MAX_RESULTS = 5;

  //* ---------------------------- UI METHODS ---------------------------------------//

  @AuraEnabled(Cacheable=true)
  public static List<LookupSearchResult> search(
    String searchTerm,
    List<String> selectedIds,
    String objectApiName
  ) {
    if (!isObjectExist(objectApiName)) {
      throw new AuraHandledException('Not a valid SObject');
    }

    List<LookupSearchResult> results = new List<LookupSearchResult>();
    String wildSearchTerm = '%' + String.escapeSingleQuotes(searchTerm) + '%';
    String queryTemplate =
      'SELECT Id, Name FROM ' +
      objectApiName +
      ' WHERE Name LIKE:wildSearchTerm ORDER BY Name DESC LIMIT :MAX_RESULTS';

    List<SObject> records = Database.query(queryTemplate);
    // Prepare results
    for (SObject record : records) {
      results.add(
        new LookupSearchResult(
          record.Id,
          objectApiName,
          '',
          (String) record.get('Name'),
          objectApiName
        )
      );
    }
    results.sort();
    return results;
  }

  @AuraEnabled(Cacheable=true)
  public static List<LookupSearchResult> getRecentlyViewed(
    String objectApiName
  ) {
    List<LookupSearchResult> results = new List<LookupSearchResult>();
    if (!isObjectExist(objectApiName)) {
      throw new AuraHandledException('Not a valid SObject');
    }
    // Get recently viewed records for the selected Object
    List<RecentlyViewed> recentRecords = [SELECT Id, Name FROM RecentlyViewed WHERE Type = :objectApiName ORDER BY LastViewedDate DESC LIMIT : MAX_RESULTS];
    // Convert recent records into LookupSearchResult
    for (RecentlyViewed recentRecord : recentRecords) {
      results.add(
        new LookupSearchResult(
          recentRecord.Id,
          objectApiName,
          '',
          recentRecord.Name,
          objectApiName
        )
      );
    }
    return results;
  }

  //* ---------------------------- UTILITY METHODS ------------------------------------------//

  private static boolean isObjectExist(String objectApiName) {
    Type objName = Type.forName(objectApiName);
    if (objName != null) {
      return true;
    }
    return false;
  }
}
