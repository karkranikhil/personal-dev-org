/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 03-08-2022
 * @last modified by  : ErickSixto
 **/
public with sharing class NoteWrapper {
  public NoteWrapper() {
  }
  @AuraEnabled
  public Id Id;
  @AuraEnabled
  public String Title;
  @AuraEnabled
  public String Content;
  @AuraEnabled
  public String originalValue;
  @AuraEnabled
  public Boolean isModified;
  @AuraEnabled
  public String RecordName;
  @AuraEnabled
  public Id RecordId;
  @AuraEnabled
  public Datetime LastModifiedDate;
}
