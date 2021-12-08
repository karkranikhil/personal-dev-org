/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 12-07-2021
 * @last modified by  : ErickSixto
 **/
public with sharing class SetupAssistantElement{
    public SetupAssistantElement(){
    }

    //*General Parameters
    @AuraEnabled
    public Boolean completed;
    @AuraEnabled
    public Integer index;
    @AuraEnabled
    public String title;
    @AuraEnabled
    public String description;
    @AuraEnabled
    public String additionalInfo;
    @AuraEnabled
    public String badge;
    @AuraEnabled
    public String badgeVariant;
    //* First Button
    @AuraEnabled
    public String firstLabel;
    @AuraEnabled
    public String firstValue;
    @AuraEnabled
    public String firstIconName;
    //* Second Button
    @AuraEnabled
    public String secondLabel;
    @AuraEnabled
    public String secondValue;
    @AuraEnabled
    public String secondIconName;
    //* Third Button
    @AuraEnabled
    public String thirdLabel;
    @AuraEnabled
    public String thirdValue;
    @AuraEnabled
    public String thirdIconName;

}