import { LightningElement, api, wire } from "lwc";
import getAccounts from "@salesforce/apex/AccountPayerController.getAccounts";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class AccountPayerWidget extends LightningElement {
  @api recordId;
  @api title;
  @api objectApiName;
  @api payerFieldApiName;
  @api limit = 10;
  accounts;
  payerId;
  isLoading = false;
  errorMessage;
  noAccountsMessage;

  // Define columns for datatable
  columns = [
    {
      label: "Name",
      fieldName: "nameUrl",
      type: "url",
      typeAttributes: { label: { fieldName: "Name" }, target: "_blank" }
    },
    {
      label: "Type",
      fieldName: "AccountType",
      type: "text",
      wrapText: true
    },
    { label: "Phone", fieldName: "Phone", type: "phone" },
    {
      label: "Is Preffered",
      fieldName: "PreferredPartner",
      type: "boolean"
    }
  ];

  get fields() {
    return [this.objectApiName + "." + this.payerFieldApiName];
  }

  @wire(getRecord, { recordId: "$recordId", fields: "$fields" })
  wiredRecord({ error, data }) {
    if (data) {
      this.payerId = getFieldValue(data, this.fields[0]);

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
    getAccounts({ payerId: this.payerId, maxLimit: this.limit })
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
