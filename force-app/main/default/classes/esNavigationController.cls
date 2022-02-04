/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 02-04-2022
 * @last modified by  : ErickSixto
 **/
public with sharing class esNavigationController{
    @AuraEnabled
    public static List<NavigationMenuItem> getNavigationItems(String NavigationDeveleoperName){
        try{
            return [SELECT Id, Label, Position, Target, Type
                    FROM NavigationMenuItem
                    WHERE NavigationLinkSet.DeveloperName = :NavigationDeveleoperName AND Status = 'Live'
                    ORDER BY Position ASC];
        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

}