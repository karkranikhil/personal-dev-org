/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 01-22-2022
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
    String nameField = getNameField(objectApiName);

    String wildSearchTerm = '%' + String.escapeSingleQuotes(searchTerm) + '%';
    String queryTemplate =
      'SELECT Id, ' +
      nameField +
      ' FROM ' +
      objectApiName +
      ' WHERE ' +
      nameField +
      ' LIKE:wildSearchTerm ORDER BY ' +
      nameField +
      ' DESC LIMIT :MAX_RESULTS';

    List<SObject> records = Database.query(queryTemplate);
    // Prepare results
    for (SObject record : records) {
      results.add(
        new LookupSearchResult(
          record.Id,
          objectApiName,
          '',
          (String) record.get(nameField),
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
    List<RecentlyViewed> recentRecords = [
      SELECT Id, Name
      FROM RecentlyViewed
      WHERE Type = :objectApiName
      ORDER BY LastViewedDate DESC
      LIMIT :MAX_RESULTS
    ];
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

  private static Boolean isObjectExist(String objectApiName) {
    Type objName = Type.forName(objectApiName);
    if (objName != null) {
      return true;
    }
    return false;
  }

  private static String getNameField(String objectApiName) {
    return [
      SELECT QualifiedApiName
      FROM FieldDefinition
      WHERE
        EntityDefinition.QualifiedApiName = :objectApiName
        AND IsNameField = TRUE
      LIMIT 1
    ]
    .QualifiedApiName;
  }
}
