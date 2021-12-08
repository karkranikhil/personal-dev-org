/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 12-07-2021
 * @last modified by  : ErickSixto
 **/
@isTest
private class SetupAssistantElementTest{
    @isTest
    private static void testTestCase(){
        // Test data setup

        // Actual test
        Test.startTest();
        SetupAssistantElement element = new SetupAssistantElement();

        Boolean completed = element.completed;

        Integer index = element.index;

        String title = element.title;

        String description = element.description;

        String additionalInfo = element.additionalInfo;

        String firstLabel = element.firstLabel;

        String firstValue = element.firstValue;

        String firstIconName = element.firstIconName;

        String secondLabel = element.secondLabel;

        String secondValue = element.secondValue;

        String secondIconName = element.secondIconName;

        String thirdLabel = element.thirdLabel;

        String thirdValue = element.thirdValue;

        String thirdIconName = element.thirdIconName;

        String badge = element.badge;

        String badgeVariant = element.badgeVariant;


        Test.stopTest();

        // Asserts
    }
}