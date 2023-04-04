import { LightningElement, api, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import FIRSTNAME_FIELD from "@salesforce/schema/Contact.FirstName";
import LASTNAME_FIELD from "@salesforce/schema/Contact.LastName";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { CloseActionScreenEvent } from "lightning/actions";

export default class StatementOfAccountAction extends LightningElement {
  @api recordId;
  @api objectApiName;

  @wire(getRecord, {
    recordId: "$recordId",
    fields: [FIRSTNAME_FIELD, LASTNAME_FIELD]
  })
  contact;

  get firstName() {
    return this.contact.data ? this.contact.data.fields.FirstName.value : null;
  }

  get lastName() {
    return this.contact.data ? this.contact.data.fields.LastName.value : null;
  }

  get invoicePdfUrl() {
    return `/apex/statementOfAccountPDF?contactId=${this.recordId}`;
  }

  handleSuccess(e) {
    // Close the modal window and display a success toast
    this.dispatchEvent(new CloseActionScreenEvent());
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Success",
        message: "Method activated",
        variant: "info"
      })
    );
  }
}
