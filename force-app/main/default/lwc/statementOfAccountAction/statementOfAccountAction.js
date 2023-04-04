import { LightningElement, api, wire, track } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import FIRSTNAME_FIELD from "@salesforce/schema/Contact.FirstName";
import LASTNAME_FIELD from "@salesforce/schema/Contact.LastName";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { CloseActionScreenEvent } from "lightning/actions";
import isValid from "@salesforce/apex/StatementOfAccountController.isValid";

export default class StatementOfAccountAction extends LightningElement {
  @api recordId;
  @api objectApiName;
  @track contact;
  isValid = false;
  isLoading = true;

  @wire(getRecord, {
    recordId: "$recordId",
    fields: [FIRSTNAME_FIELD, LASTNAME_FIELD]
  })
  wiredContact({ error, data }) {
    if (error) {
      this.dispatchEvent(
        new ShowToastEvent({
          title: "Error",
          message: "There was an error getting the contact information.",
          variant: "error"
        })
      );
    } else if (data) {
      this.contact = { ...data };
      this.isValid = isValid({ contactId: this.recordId }).finally(
        () => (this.isLoading = false)
      );
    }
  }

  get firstName() {
    return this.contact ? this.contact.fields.FirstName.value : null;
  }

  get lastName() {
    return this.contact ? this.contact.fields.LastName.value : null;
  }

  get invoicePdfUrl() {
    return `/apex/statementOfAccountPDF?contactId=${this.recordId}`;
  }
}
