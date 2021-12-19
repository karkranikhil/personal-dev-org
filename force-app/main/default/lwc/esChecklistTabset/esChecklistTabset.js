import { LightningElement, api, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getContacts from "@salesforce/apex/EsChecklistController.getContacts";
import getRelatedRecordMap from "@salesforce/apex/EsChecklistController.getRelatedRecordMap";
import saveDraftValues from "@salesforce/apex/EsChecklistController.saveDraftValues";
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
    this.getRelatedRecords();
    this.getFinalChecks();
  }

  renderedCallback() {
    this.setLoading(false);
  }

  //* Data to be rendered at tab 2 (table)
  getRelatedRecords() {
    getContacts({ recordId: this.recordId }).then((result) => {
      this.data = result.map((record) => ({
        ...record,
        //? Map the fields to the ones described on the 'colums' const
        Id: record.Contact__c, //! CHANGE THE ID OF THE JUNCTION OBJECT WITH THE ID OF THE TARGET
        urlId: "/" + record.Contact__c,
        Name: record.Contact__r.Name,
        Email: record.Contact__r.Email,
        Phone: record.Contact__r.Phone
        //? ... Here you can map more fields if needed
      }));
    });
  }

  //* Get related record that contains the checkboxes for tab 3
  getFinalChecks() {
    getRelatedRecordMap({ recordId: this.recordId }).then((result) => {
      this.relatedRecord = result;
      console.log(result);
    });
  }

  //* Form Handling
  handleSubmit() {
    this.setLoading(true);
  }

  //* Table Handling
  handleSave(event) {
    this.saveDraftValues = event.detail.draftValues;
    saveDraftValues({ data: this.saveDraftValues })
      .then(() => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: "Records updated successfully",
            variant: "success"
          })
        );
        //Get the updated list.
        this.getRelatedRecords();
      })
      .catch((error) => {
        console.log("error : " + JSON.stringify(error));
      });
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
