import { LightningElement, api, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getContacts from "@salesforce/apex/EsChecklistController.getContacts";
import getRelatedRecordMap from "@salesforce/apex/EsChecklistController.getRelatedRecordMap";
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
  { label: "Name", fieldName: "Name", type: "text", editable: true },
  { label: "Phone", fieldName: "Phone", type: "phone", editable: true },
  { label: "Email", fieldName: "Email", type: "email", editable: true }
];
export default class EsChecklistTabset extends LightningElement {
  @api recordId;
  @track data;
  @track relatedRecord; //* Used for tab 3
  columns = columns;
  loading = true;

  connectedCallback() {
    getContacts({ recordId: this.recordId }).then((result) => {
      this.data = result.map((record) => ({
        ...record,
        //? Map the fields to the ones described on the 'colums' const
        urlId: "/" + record.Id,
        Name: record.Contact__r.Name,
        Email: record.Contact__r.Email,
        Phone: record.Contact__r.Phone
        //? ... Here you can map more fields if needed
      }));
    });
    getRelatedRecordMap({ recordId: this.recordId }).then((result) => {
      this.relatedRecord = result;
      console.log(result);
    });
  }

  renderedCallback() {
    this.setLoading(false);
  }

  //* Form Handling
  handleSubmit() {
    this.setLoading(true);
  }

  //* Table Handling
  handleSave(event) {
    this.saveDraftValues = event.detail.draftValues;
    console.log(event.detail.draftValues);
  }

  //* Toasts
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
