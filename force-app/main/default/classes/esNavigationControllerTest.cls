/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 02-06-2022
 * @last modified by  : ErickSixto
 **/
@isTest
private class esNavigationControllerTest{
    @IsTest
    static void testQuery(){

        Test.startTest();

        List<NavigationMenuItem> items = esNavigationController.getNavigationItems('Test');
        Test.stopTest();
    }

}