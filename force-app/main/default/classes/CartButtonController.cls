public with sharing class CartButtonController {
    @AuraEnabled
    public static Decimal getCount(String flowName, Map<String, Object> inputVariables) {
        // Get the Flow from the FlowDefinition
        Flow.Interview flow = Flow.Interview.createInterview(flowName, inputVariables);

        // Start the Flow
        flow.start();

        // Return the value of the output variable from the Flow
        // We are assuming your Flow has an output variable named 'productCount'
        return (Decimal) flow.getVariableValue('productCount');
    }
}
