import { LightningElement, track, wire, api } from "lwc";
import getFundings from "@salesforce/apex/WarehouseAssignmentsController.getFundings";
import { NavigationMixin } from "lightning/navigation";
import getRemainingBalance from "@salesforce/apex/FundingBalanceCalController.getRemainingBalance";
import getColumns from "@salesforce/apex/FundingBalanceCalController.getTableColumns";
import getRemainingBal from "@salesforce/apex/FundingBalanceRemainingController.getRemainingBalance";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from "@salesforce/apex";
import updateFundings from "@salesforce/apex/WarehouseAssignmentsController.updateFunding";
import getRemainingBalance30 from "@salesforce/apex/FundingBalanceNDays.getRemainingBalance";
import getColumns30 from "@salesforce/apex/FundingBalanceNDays.getTableColumns";
import { getRecordNotifyChange } from "lightning/uiRecordApi";
//import fundingReport from '@salesforce/label/c.ActiveFundingsReportURL';

const columnsBal = [
  { label: "WH Lender", fieldName: "resultContact", type: "text" },
  {
    label: "Balance",
    fieldName: "resultBalance",
    type: "currency",
    typeAttributes: { currencyCode: "USD" }
  },
  {
    label: "Investor Restriction Details",
    fieldName: "resultInvestorRestrictionDetails",
    type: "text"
  }
];

const columns = [
  { label: "WH Lender", fieldName: "resultContact", type: "text" },
  {
    label: "Day1",
    fieldName: "day1",
    type: "currency",
    typeAttributes: { currencyCode: "USD" }
  }
];

const columnsWH = [
  {
    type: "button",
    typeAttributes: {
      label: "Choices",
      name: "RemainFun",
      title: "Choices",
      disabled: false,
      value: "Choices",
      iconPosition: "left"
    }
  },

  {
    label: "Is Reviewed",
    fieldName: "reviewed",
    type: "boolean",
    editable: true
  },
  { label: "Field/Event", fieldName: "fieldevent", type: "text" },

  //{label: 'Provider', fieldName: 'provider', type: 'text',editable:true},

  //comienza lookup

  {
    label: "Provider Name", //Column Header Shown in Table
    //? Is this the Apiname of the field?
    fieldName: "provider", //Api name of field
    type: "lookup",
    typeAttributes: {
      placeholder: "Choose Provider",
      object: "Funding__c",
      fieldName: "Provider__c",
      label: "Provider",
      value: { fieldName: "Provider__c" },
      context: { fieldName: "Id" },
      variant: "label-hidden",
      name: "Provider",
      fields: ["Provider__r.Name"],
      target: "_self" //	Opens the component in the same frame as it was clicked
    },
    editable: true,
    cellAttributes: {
      // ? Hardcoding styles
      class: { fieldName: "slds-cell-edit" }
    }
  },

  {
    label: "Opportunity Name",
    fieldName: "nameUrl",
    type: "url",
    typeAttributes: {
      label: { fieldName: "opportunityName" },
      target: "_blank"
    }
  },
  {
    label: "RateLocked Date",
    fieldName: "rateLockedDate",
    type: "date-local",
    typeAttributes: {
      day: "numeric",
      month: "numeric",
      year: "numeric"
    }
  },
  {
    label: "Close Date",
    fieldName: "closeDate",
    type: "date-local",
    typeAttributes: {
      day: "numeric",
      month: "numeric",
      year: "numeric"
    }
  },
  {
    label: "Funding Date",
    fieldName: "fundingDate",
    type: "date-local",
    editable: true,
    typeAttributes: {
      day: "numeric",
      month: "numeric",
      year: "numeric"
    }
  },
  {
    label: "Stop Stamping FD",
    fieldName: "confirmed",
    type: "boolean",
    editable: true
  },
  {
    label: "BED/Purchase Date",
    fieldName: "deliveryDate",
    type: "date-local",
    editable: true,
    typeAttributes: {
      day: "numeric",
      month: "numeric",
      year: "numeric"
    }
  },
  {
    label: "Payoff Date",
    fieldName: "payoffDate",
    type: "date-local",
    editable: true,
    typeAttributes: {
      day: "numeric",
      month: "numeric",
      year: "numeric"
    }
  },
  { label: "Loan Amount", fieldName: "loanAmount", type: "currency" },
  { label: "Funding Amount", fieldName: "fundingAmount", type: "currency" },
  { label: "Closer", fieldName: "closer", type: "text" },
  {
    label: "Pass Through",
    fieldName: "passThrough",
    type: "percent",
    typeAttributes: {
      minimumFractionDigits: "6"
    }
  },
  { label: "Trade Desk Company", fieldName: "tradeDesk", type: "text" }
];

export default class WarehouseAssignments extends LightningElement {
  //showModal = true;
  records;
  dataWH = [];
  columnsWH = columnsWH;
  @track record;
  @api inputDate = new Date();
  @track scope;
  showModal = false;
  data = [];
  columns = [];
  @track scope30;
  showModal30 = false;
  data30 = [];
  columns30 = [];

  @track inputDateBal = new Date();
  showModalBal = false;
  dataBal = [];
  columnsBal = columnsBal;

  @wire(getFundings, {})
  wiredFunding({ error, data }) {
    if (data) {
      this.dataWH = data;
      console.log(JSON.parse(JSON.stringify(this.dataWH)));
    } else if (error) {
      this.dataWH = undefined;
    }
  }

  //Comienza mio
  // Event to register the datatable lookup mark up.
  handleItemRegister(event) {
    event.stopPropagation(); //stops the window click to propagate to allow to register of markup.
    const item = event.detail;
    if (!this.privateChildren.hasOwnProperty(item.name))
      this.privateChildren[item.name] = {};
    this.privateChildren[item.name][item.guid] = item;
  }

  async handleSave(event) {
    console.log("draft val" + JSON.stringify(event.detail.draftValues));
    const updatedFields = event.detail.draftValues;

    const notifyChangeIds = updatedFields.map((row) => {
      return { recordId: row.Id };
    });

    await updateFundings({ data: updatedFields })
      .then((result) => {
        console.log(JSON.stringify("Apex update result: " + result));
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: "Records updated",
            variant: "success"
          })
        );

        // Refresh LDS cache and wires
        //getRecordNotifyChange(notifyChangeIds);

        // Display fresh data in the datatable
        refreshApex(this.dataWH).then(() => {
          // Clear all draft values in the datatable
          //this.draftValues = [];
        });
      })
      .catch((error) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error updating or refreshing records",
            message: error.body.message,
            variant: "error"
          })
        );
      });
  }
  handleClick(event) {
    this.clickedButtonLabel = event.target.label;
  }

  callRowAction(event) {
    var funddate = event.detail.row.fundingDate;
    //const actionName = event.detail.action.name;
    console.log("funddate " + funddate);
    //if(funddate !== 'undefined')
    //{
    this.inputDateBal = funddate;
    //}
    console.log("inputDateBal " + inputDateBal);
    this.showModalBal = true;
    /* if (actionName === 'CalFun') {  
  
            this[NavigationMixin.Navigate]({  
                type: 'standard__component',  
                attributes: {  
                    componentName: "c__NavigatetoFundingCal"                      
                },
                state: {
                    c__inputDate: funddate
                }  
            });   
        } 
        else if ( actionName === 'RemainFun') {  
  
            this[NavigationMixin.Navigate]({  
                type: 'standard__component',  
                attributes: {  
                    componentName: "c__NavigateToLWC"                      
                }  
            });  
        } */
  }

  changeHandler(event) {
    if (event.target.name == "inputDate") {
      this.inputDate = event.target.value;
    }
  }

  closeModal(event) {
    this.showModal = false;
  }

  handleGetBalance(event) {
    console.log(JSON.stringify(event.target.dataset));
    console.log(event.target.dataset.name);
    if (event.target.dataset.name == "Init") {
      this.scope = 0;
    }
    if (event.target.dataset.name == "Next") {
      this.scope = this.scope + 1;
    }
    if (event.target.dataset.name == "Prev") {
      this.scope = this.scope - 1;
    }

    if (this.scope == null) {
      this.scope = 0;
    }
    console.log("input date: " + this.inputDate);
    getColumns({
      //imperative Apex call
      inputDate: this.inputDate,
      days: this.scope
    })
      .then((returnValue) => {
        console.log("returned: %O", returnValue);
        console.log("returned: " + JSON.stringify(returnValue));
        //this.data = returnvalue;
        this.columns = returnValue;
      })
      .catch((error) => {
        console.info("error");
        //code to execute if related contacts are not returned successfully
      });

    getRemainingBalance({
      //imperative Apex call
      inputDate: this.inputDate,
      days: this.scope
    })
      .then((returnValue) => {
        console.log("returned: %O", returnValue);
        console.log("returned: " + JSON.stringify(returnValue));
        //this.data = returnvalue;
        this.data = returnValue;
        this.showModal = true;
      })
      .catch((error) => {
        console.info("error");
        //code to execute if related contacts are not returned successfully
      });
    console.log(this.scope);

    console.log(this.scope + "::::scope");
  }

  changeHandlerBal(event) {
    if (event.target.name == "inputDate") {
      this.inputDateBal = event.target.value;
    }
  }

  closeModalBal(event) {
    this.showModalBal = false;
  }

  handleGetBalanceBal(event) {
    getRemainingBal({
      //imperative Apex call
      //inputDate: this.inputDateBal
      inputDate: event.detail.row.fundingDate
    })
      .then((returnValue) => {
        console.log("returned: %O", returnValue);
        console.log("returned: " + JSON.stringify(returnValue));
        //this.data = returnvalue;
        this.dataBal = returnValue;
        this.showModalBal = true;
      })
      .catch((error) => {
        console.info("error");
        //code to execute if related contacts are not returned successfully
      });
  }

  closeModal30(event) {
    this.showModal30 = false;
  }

  handleGetBalance30(event) {
    console.log(JSON.stringify(event.target.dataset));
    console.log(event.target.dataset.name);
    if (event.target.dataset.name == "Init") {
      this.scope30 = 0;
    }
    if (event.target.dataset.name == "Next") {
      this.scope30 = this.scope30 + 1;
    }
    if (event.target.dataset.name == "Prev") {
      this.scope30 = this.scope30 - 1;
    }

    if (this.scope30 == null) {
      this.scope30 = 0;
    }

    getColumns30({
      //imperative Apex call
      inputDate: this.inputDate,
      days: this.scope30
    })
      .then((returnValue) => {
        //this.data = returnvalue;
        this.columns30 = returnValue;
      })
      .catch((error) => {
        console.info("error");
        //code to execute if related contacts are not returned successfully
      });
    getRemainingBalance30({
      //imperative Apex call
      inputDate: this.inputDate,
      days: this.scope30,
      noOfDays: 30
    })
      .then((returnValue) => {
        //this.data = returnvalue;
        this.data30 = returnValue;
        this.showModal30 = true;
      })
      .catch((error) => {
        console.info("error");
        //code to execute if related contacts are not returned successfully
      });
  }
  handleFundingReport(event) {
    window.open("/lightning/r/Report/00O5G000007rd9hUAA/view", "_blank");
  }
}
