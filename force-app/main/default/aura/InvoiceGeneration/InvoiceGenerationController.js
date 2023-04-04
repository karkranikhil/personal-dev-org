({
    /*
    *@author      : 
    *@description : called on load  
    *@revision    : (Created : 08-09-2021)
    */
	doInit : function(component, event, helper) {
        var pageReferenceUrl = component.get("v.pageReference");
        if(pageReferenceUrl){
             component.set("v.isNewTab",true);
             component.set("v.recordId", pageReferenceUrl.state.c__refRecordId); 
        }else{
            helper.fetchAllReceiptsToGenerateInvoice(component, event, helper);
        }
	},
    
    /*
    *@author      : 
    *@description : called on load complete  
    *@revision    : (Created : 08-09-2021)
    */            
    handleCancel : function(component, event, helper) {
        $A.get("e.force:closeQuickAction").fire();
    },
     
    /*
    *@author      : 
    *@description : called to save Invoice and Send EMail 
    *@revision    : (Created : 08-09-2021)
    */
    handleSaveAndEmail : function(component, event, helper) {
        helper.saveAndEmailInvoice(component, event, helper);
    }, 
    
    /*
    *@author      : 
    *@description : called to allowed only one receipt for selection
    *@revision    : (Created : 09-26-2021)
    */
    handleReceiptSelection : function(component, event, helper) {
        let lstReceipts = component.get("v.lstReceipts");
        let selectedReceiptId = event.getSource().get("v.label");
        
        lstReceipts.forEach(receipt =>{
            receipt.selected = selectedReceiptId == receipt.Id
        });
        component.set("v.lstReceipts",lstReceipts);
        component.set("v.selectedReceiptId",selectedReceiptId);
    },
    
    /*
    *@author      : 
    *@description : called to generate Invoice in new Tab 
    *@revision    : (Created : 09-26-2021)
    */
    handleGenerateInvoice : function(component, event, helper){
        let lstReceipts = component.get("v.lstReceipts");
        let selectedReceiptId = null;
        lstReceipts.forEach(receipt =>{
            if(receipt.selected){
            	selectedReceiptId = receipt.Id;
        	}
        });
        
        if(!selectedReceiptId){
            helper.showToast("Error","Please select Receipt to Generate Invoice!!");
            return;
        }
        var pageReference = {
            type: 'standard__component',
            attributes: {
                componentName: 'c__InvoiceGeneration'
            },
            state: {
                c__refRecordId: selectedReceiptId
            }
        };
        
        component.set("v.pageReference", pageReference);
        const navService = component.find('navService');
        const pageRef = component.get('v.pageReference');
        const handleUrl = (url) => {
            window.open(url);
        };
            
        const handleError = (error) => {
            console.log(error);
        };
            
        navService.generateUrl(pageRef).then(handleUrl, handleError);
        $A.get("e.force:closeQuickAction").fire();    
    }
})