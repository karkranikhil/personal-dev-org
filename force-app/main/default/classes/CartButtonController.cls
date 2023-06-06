public with sharing class CartButtonController{
    @AuraEnabled
    public static Decimal getCount(String flowName, Map<String, Object> inputVariables){
        // Get the Flow from the FlowDefinition
        Flow.Interview flow = Flow.Interview.createInterview(flowName, inputVariables);

        // Start the Flow
        flow.start();

        // Return the value of the output variable from the Flow
        // We are assuming your Flow has an output variable named 'productCount'
        return (Decimal) flow.getVariableValue('productCount');
    }

    @AuraEnabled
    public static Map<String, String> getSessionData(){
        Map<String, String> data = new Map<String, String>();
        data.put('sessionId', UserInfo.getSessionId());
        data.put('instanceUrl', Url.getOrgDomainUrl().toExternalForm());
        return data;
    }

}