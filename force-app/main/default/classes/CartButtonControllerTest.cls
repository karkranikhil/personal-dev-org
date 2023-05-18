@isTest
public class CartButtonControllerTest {
    @isTest
    static void testGetSessionData() {
        // Call the method
        Map<String, String> result = CartButtonController.getSessionData();
        
        // Check the result
        System.assert(result.containsKey('sessionId'), 'Map should contain key "sessionId"');
        System.assert(result.containsKey('instanceUrl'), 'Map should contain key "instanceUrl"');
    }

    @isTest
    static void testGetCount() {
        // Provide a default flow name
        String flowName = 'Get_Product_Count_Invokable';
        // Provide default input variables
        Map<String, Object> inputVariables = new Map<String, Object>();

        // We're mainly checking this doesn't throw any exceptions,
        // as we can't actually execute the Flow and check the output in Apex test.
        Test.startTest();
        Decimal result;
        try {
            result = CartButtonController.getCount(flowName, inputVariables);
        } catch (Exception e) {
            System.assert(false, 'Unexpected exception: ' + e.getMessage());
        }
        Test.stopTest();
    }
}
