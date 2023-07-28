import { LightningElement, api, wire } from "lwc";
import getPayerIdFromRecord from "@salesforce/apex/AccountPayerController.getPayerIdFromRecord";
import getAccounts from "@salesforce/apex/AccountPayerController.getAccounts";
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

  connectedCallback() {
    this.isLoading = true;
    getPayerIdFromRecord({
      recordId: this.recordId,
      objectApiName: this.objectApiName,
      payerFieldApiName: this.payerFieldApiName
    })
      .then((result) => {
        this.payerId = result;
        if (!result) {
          this.errorMessage = "No Pverify Payer Selected";
        }
      })
      .catch((error) => {
        this.errorMessage = "Error loading payer ID: " + error.body.message;
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

  @wire(getAccounts, { payerId: "$payerId" })
  wiredAccounts({ error, data }) {
    if (data) {
      this.accounts = data;
      if (data.length === 0) {
        this.noAccountsMessage = "No related B2B Accounts";
      }
    } else if (error) {
      this.errorMessage = "Error loading accounts: " + error.body.message;
      this.dispatchEvent(
        new ShowToastEvent({
          title: "Error",
          message: this.errorMessage,
          variant: "error"
        })
      );
    }
  }
}
