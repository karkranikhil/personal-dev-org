/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 02-06-2022
 * @last modified by  : ErickSixto
 **/
public with sharing class esNavigationController{
    @AuraEnabled
    public static List<NavigationMenuItem> getNavigationItems(String NavigationDeveleoperName){

        return [SELECT Id, Label, Position, Target, Type
                FROM NavigationMenuItem
                WHERE NavigationLinkSet.DeveloperName = :NavigationDeveleoperName AND Status = 'Live'
                ORDER BY Position ASC];
    }

}