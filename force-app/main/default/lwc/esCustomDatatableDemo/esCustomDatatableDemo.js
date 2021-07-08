/* eslint-disable guard-for-in */
/* eslint-disable no-prototype-builtins */
import { LightningElement, wire } from "lwc";
import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getRelatedRecords from "@salesforce/apex/CaseRelatedListController.getRelatedRecords";
import saveDraftValues from "@salesforce/apex/CaseRelatedListController.saveDraftValues";

const COLUMNS = [
  {
    label: "Case Number",
    fieldName: "linkName",
    type: "url",
    typeAttributes: {
      label: { fieldName: "CaseNumber" },
      target: "_self"
    }
  },
  {
    label: "Account Name",
    fieldName: "AccountId",
    type: "lookup",
    typeAttributes: {
      placeholder: "Choose Account",
      object: "Case",
      fieldName: "AccountId",
      label: "Account",
      value: { fieldName: "AccountId" },
      context: { fieldName: "Id" },
      variant: "label-hidden",
      name: "Account",
      fields: ["Account.Name"],
      target: "_self"
    },
    editable: true,
    cellAttributes: {
      class: { fieldName: "accountNameClass" }
    }
  },
  {
    label: "Contact Name",
    fieldName: "ContactId",
    type: "lookup",
    typeAttributes: {
      placeholder: "Choose Contact",
      object: "Case",
      fieldName: "ContactId",
      label: "Contact",
      value: { fieldName: "ContactId" },
      context: { fieldName: "Id" },
      variant: "label-hidden",
      name: "Contact",
      fields: ["Contact.Name"],
      target: "_self"
    },
    editable: true,
    cellAttributes: {
      class: { fieldName: "contactNameClass" }
    }
  }
];

export default class EsCustomDatatableDemo extends LightningElement {
  columns = COLUMNS;
  records;
  lastSavedData;
  error;
  accountId;
  contactId;
  wiredRecords;
  showSpinner = false;
  draftValues = [];
  privateChildren = {}; //used to get the datatable lookup as private childern of customDatatable

  renderedCallback() {
    if (!this.isComponentLoaded) {
      /* Add Click event listener to listen to window click to reset the lookup selection 
            to text view if context is out of sync*/
      window.addEventListener("click", (evt) => {
        this.handleWindowOnclick(evt);
      });
      this.isComponentLoaded = true;
    }
  }

  disconnectedCallback() {
    window.removeEventListener("click", () => {});
  }

  handleWindowOnclick(context) {
    this.resetPopups("c-datatable-lookup", context);
  }

  //create object value of datatable lookup markup to allow to call callback function with window click event listener
  resetPopups(markup, context) {
    let elementMarkup = this.privateChildren[markup];
    if (elementMarkup) {
      Object.values(elementMarkup).forEach((element) => {
        element.callbacks.reset(context);
      });
    }
  }

  //wire function to get the Case records on load
  @wire(getRelatedRecords)
  wiredRelatedRecords(result) {
    this.wiredRecords = result;
    const { data, error } = result;
    if (data) {
      this.records = JSON.parse(JSON.stringify(data));
      this.records.forEach((record) => {
        //? Assign the classes to the lookup fields and the url sintaxis to the name field
        record.linkName = "/" + record.Id;
        record.accountNameClass = "slds-cell-edit";
        record.contactNameClass = "slds-cell-edit";
      });
      this.error = undefined;
    } else if (error) {
      this.records = undefined;
      this.error = error;
    } else {
      this.error = undefined;
      this.records = undefined;
    }
    this.lastSavedData = this.records;
    this.showSpinner = false;
  }

  // Event to register the datatable lookup mark up.
  handleItemRegister(event) {
    event.stopPropagation(); //stops the window click to propagate to allow to register of markup.
    const item = event.detail;
    if (!this.privateChildren.hasOwnProperty(item.name))
      this.privateChildren[item.name] = {};
    this.privateChildren[item.name][item.guid] = item;
  }

  handleChange(event) {
    event.preventDefault();
    console.log("handleChange");
    console.log(event.target.label);
    console.log(event.target.value);
    this.accountId = event.target.value;
    this.showSpinner = true;
  }

  handleCancel(event) {
    event.preventDefault();
    console.log("handleChange");
    this.records = JSON.parse(JSON.stringify(this.lastSavedData));
    this.handleWindowOnclick("reset");
    this.draftValues = [];
  }

  handleCellChange(event) {
    event.preventDefault();
    console.log("handleCellChange");
    this.updateDraftValues(event.detail.draftValues[0]);
  }

  //Captures the changed lookup value and updates the records list variable.
  handleValueChange(event) {
    event.stopPropagation();
    console.log("handleValueChange");
    console.log(event.target.data.label);
    let dataRecieved = event.detail.data;
    let updatedItem;
    switch (dataRecieved.label) {
      case "Account":
        updatedItem = {
          Id: dataRecieved.context,
          AccountId: dataRecieved.value
        };
        // Set the cell edit class to edited to mark it as value changed.
        this.setClassesOnData(
          dataRecieved.context,
          "accountNameClass",
          "slds-cell-edit slds-is-edited"
        );
        break;

      case "Contact":
        updatedItem = {
          Id: dataRecieved.context,
          ContactId: dataRecieved.value
        };
        // Set the cell edit class to edited to mark it as value changed.
        this.setClassesOnData(
          dataRecieved.context,
          "contactNameClass",
          "slds-cell-edit slds-is-edited"
        );
        break;
      default:
        this.setClassesOnData(dataRecieved.context, "", "");
        break;
    }
    this.updateDraftValues(updatedItem);
    this.updateDataValues(updatedItem);
  }

  updateDataValues(updateItem) {
    console.log("updateDataValues");
    let copyData = JSON.parse(JSON.stringify(this.records));
    copyData.forEach((item) => {
      if (item.Id === updateItem.Id) {
        for (let field in updateItem) {
          item[field] = updateItem[field];
        }
      }
    });
    this.records = [...copyData];
  }

  updateDraftValues(updateItem) {
    console.log("updateDraftValues");
    let draftValueChanged = false;
    let copyDraftValues = JSON.parse(JSON.stringify(this.draftValues));
    copyDraftValues.forEach((item) => {
      if (item.Id === updateItem.Id) {
        for (let field in updateItem) {
          item[field] = updateItem[field];
        }
        draftValueChanged = true;
      }
    });
    if (draftValueChanged) {
      this.draftValues = [...copyDraftValues];
    } else {
      this.draftValues = [...copyDraftValues, updateItem];
    }
  }

  handleEdit(event) {
    event.preventDefault();
    console.log("handleEdit");
    console.log(event.target.data);
    let dataRecieved = event.detail.data;
    this.handleWindowOnclick(dataRecieved.context);
    switch (dataRecieved.label) {
      case "Account":
        this.setClassesOnData(
          dataRecieved.context,
          "accountNameClass",
          "slds-cell-edit"
        );
        break;
      case "Contact":
        this.setClassesOnData(
          dataRecieved.context,
          "contactNameClass",
          "slds-cell-edit"
        );
        break;
      default:
        this.setClassesOnData(dataRecieved.context, "", "");
        break;
    }
  }

  setClassesOnData(id, fieldName, fieldValue) {
    this.records = JSON.parse(JSON.stringify(this.records));
    this.records.forEach((detail) => {
      if (detail.Id === id) {
        detail[fieldName] = fieldValue;
      }
    });
  }

  handleSave(event) {
    event.preventDefault();
    this.showSpinner = true;
    // Update the draftvalues
    saveDraftValues({ data: this.draftValues })
      .then(() => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: "Cases updated successfully",
            variant: "success"
          })
        );
        //Get the updated list with refreshApex.
        refreshApex(this.wiredRecords).then(() => {
          this.records.forEach((record) => {
            record.accountNameClass = "slds-cell-edit";
          });
          this.draftValues = [];
        });
      })
      .catch((error) => {
        console.log("error : " + JSON.stringify(error));
        this.showSpinner = false;
      });
  }
}
