({
	/*
    *@author      : 
    *@description : this method used to make server call and handle error response if any
    *@revision    : (Created : 08-09-2021)
    */
	callToServer : function(component , method , callBackFunction , params ) {
        component.set('v.isShowSpinner',true);
        var action = component.get(method);
        
        if(params){
            action.setParams(params);
        }
        
        action.setCallback(this,function(response){
			if(response.getState() == "SUCCESS"){
                callBackFunction(response);
                component.set('v.isShowSpinner',false);
            }else{
                var errorMessageToDisplay = '';
                var errors = response.getError();
                if (errors) {
                    for (var j = 0; j < errors.length; j++) {
                        if (errors[j].pageErrors && errors[j].pageErrors.length > 0 ) {
                            for (var i = 0; i < errors[j].pageErrors.length; i++) {
                                errorMessageToDisplay += (errorMessageToDisplay.length > 0 ? '\n' : '') + errors[j].pageErrors[i].message;
                            }
                        }else if (errors[j].fieldErrors) {
                            for (var fieldError in errors[j].fieldErrors) {
                                var thisFieldError = errors[j].fieldErrors[fieldError];
                                for (var k = 0; k < thisFieldError.length; k++) {
                                    errorMessageToDisplay += (errorMessageToDisplay.length > 0 ? '\n' : '') + thisFieldError[k].message;
                                }
                            }
                        }else{
                            errorMessageToDisplay += errors[j].message;
                        }
                    }
                }
                component.set('v.isShowSpinner',false);
                this.showToast("Error",errorMessageToDisplay);
            }
        });
        
        $A.enqueueAction(action);
    },
    
    /*
    *@author      : 
    *@description : this method to show error/success toast 
    *@revision    : (Created : 08-09-2021)
    */
    showToast : function(toastType , toastMessage ) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : toastType + ' ! ',
            message: toastMessage,
            type: toastType.toLowerCase(),
            mode: 'dismissible'
        });
        toastEvent.fire();
    },
    
    /*
    *@author      : 
    *@description : this method used to make server call to store and email Invoice
    *@revision    : (Created : 08-09-2021)
    */
    saveAndEmailInvoice : function(component, event, helper) {
        let selectedReceiptId = component.get("v.selectedReceiptId");
        if(!selectedReceiptId){
            helper.showToast("Error","Please select Receipt to Generate Invoice!!");
            return;
        }
        helper.callToServer(
        	component,
            "c.saveAndEmailInvoice",
            function(response){
                helper.showToast("Success", "Invoice Send Successfully!!");
                $A.get("e.force:closeQuickAction").fire();
            },
            { 
                recordId : component.get("v.recordId"),
                receiptId : selectedReceiptId
            }
        );
    },
    
    /*
    *@author      : 
    *@description : this method used to make server call to fetch All receipt under cash for generating invoice
    *@revision    : (Created : 09-26-2021)
    */
    fetchAllReceiptsToGenerateInvoice : function(component, event, helper) {
        helper.callToServer(
        	component,
            "c.fetchAllReceiptsToGenerateInvoice",
            function(response){
                component.set("v.lstReceipts",response.getReturnValue());
            },
            { recordId : component.get("v.recordId")}
        );
    }
})