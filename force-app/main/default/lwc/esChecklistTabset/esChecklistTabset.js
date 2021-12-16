import { LightningElement, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getContacts from "@salesforce/apex/EsChecklistController.getContacts";
const columns = [
  {
    label: "Id",
    fieldName: "urlId",
    type: "url",
    typeAttributes: {
      label: { fieldName: "Id" },
      target: "_self"
    }
  },
  { label: "Name", fieldName: "Name", type: "text" },
  { label: "Phone", fieldName: "Phone", type: "phone" },
  { label: "Email", fieldName: "Email", type: "email" }
];
export default class EsChecklistTabset extends LightningElement {
  @api recordId;
  columns = columns;
  data;
  loading = true;

  connectedCallback() {
    getContacts({ recordId: this.recordId }).then((result) => {
      console.log("Case Contacts", result);
      this.data = result.map((record) => ({
        ...record,
        urlId: "/" + record.Id,
        Name: record.Contact__r.Name,
        Email: record.Contact__r.Email,
        Phone: record.Contact__r.Phone
      }));
    });
  }

  renderedCallback() {
    this.setLoading(false);
  }

  //* Form Handling
  handleSubmit() {
    this.setLoading(true);
  }
  handleSuccess() {
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Success",
        message: "Record Updated",
        variant: "success"
      })
    );
    this.setLoading(false);
  }
  handleError(event) {
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Error",
        message: event.detail.message,
        variant: "error"
      })
    );
    this.setLoading(false);
  }

  //* Utility
  setLoading(state) {
    this.loading = state;
  }
}
