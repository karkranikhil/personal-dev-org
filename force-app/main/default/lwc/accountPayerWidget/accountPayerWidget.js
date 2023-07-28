import { LightningElement, api, wire } from "lwc";
import getAccounts from "@salesforce/apex/AccountPayerController.getAccounts";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class AccountPayerWidget extends LightningElement {
  @api recordId;
  @api title;
  @api objectApiName;
  @api payerFieldApiName;
  accounts;
  payerId;
  isLoading = false;
  errorMessage;
  noAccountsMessage;

  // Define columns for datatable
  columns = [
    { label: "Account Name", fieldName: "Name" },
    { label: "Account Type", fieldName: "Type" },
    { label: "Phone", fieldName: "Phone", type: "phone" }
  ];

  get fields() {
    return [this.objectApiName + "." + this.payerFieldApiName];
  }

  @wire(getRecord, { recordId: "$recordId", fields: "$fields" })
  wiredRecord({ error, data }) {
    console.log("Wiring Record: ", this.fields);
    if (data) {
      console.log("wired record data: ", JSON.parse(JSON.stringify(data)));
      this.payerId = getFieldValue(data, this.fields[0]);
      console.log("this.payerId: ", this.payerId);
      if (!this.payerId) {
        this.errorMessage = "No Pverify Payer Selected";
      } else {
        this.errorMessage = null;
        this.getRelatedAccounts();
      }
    } else if (error) {
      this.errorMessage = "Error loading payer ID: " + error.body.message;
      this.dispatchEvent(
        new ShowToastEvent({
          title: "Error",
          message: this.errorMessage,
          variant: "error"
        })
      );
    }
  }

  getRelatedAccounts() {
    this.isLoading = true;
    getAccounts({ payerId: this.payerId })
      .then((result) => {
        this.accounts = result;
        if (result.length === 0) {
          this.noAccountsMessage = "No related B2B Accounts";
        } else {
          this.noAccountsMessage = null;
        }
      })
      .catch((error) => {
        this.errorMessage = "Error loading accounts: " + error.body.message;
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error",
            message: this.errorMessage,
            variant: "error"
          })
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
