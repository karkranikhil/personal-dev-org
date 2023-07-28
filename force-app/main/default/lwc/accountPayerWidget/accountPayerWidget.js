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

  // Define columns for datatable
  columns = [
    { label: "Account Name", fieldName: "Name" },
    { label: "Account Type", fieldName: "Type" },
    { label: "Phone", fieldName: "Phone", type: "phone" }
  ];

  connectedCallback() {
    getPayerIdFromRecord({
      recordId: this.recordId,
      objectApiName: this.objectApiName,
      payerFieldApiName: this.payerFieldApiName
    })
      .then((result) => {
        this.payerId = result;
      })
      .catch((error) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error loading payer ID",
            message: error.body.message,
            variant: "error"
          })
        );
      });
  }

  @wire(getAccounts, { payerId: "$payerId" })
  wiredAccounts({ error, data }) {
    if (data) {
      this.accounts = data;
      this.error = undefined;
    } else if (error) {
      this.dispatchEvent(
        new ShowToastEvent({
          title: "Error loading accounts",
          message: error.body.message,
          variant: "error"
        })
      );
    }
  }
}
