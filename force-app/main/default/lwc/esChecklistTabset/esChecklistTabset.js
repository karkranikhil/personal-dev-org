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
  //! The 'FielName' must be the Apiname of the Target Object for the update to work (example, Not use Contact__r.Name, but Name)
  { label: "First Name", fieldName: "FirstName", type: "text", editable: true },
  { label: "Last Name", fieldName: "LastName", type: "text", editable: true },
  { label: "Phone", fieldName: "Phone", type: "phone", editable: true },
  {
    label: "Email",
    fieldName: "Email",
    type: "email",
    title: "Email",
    editable: true
  }
];
export default class EsChecklistTabset extends LightningElement {
  @api recordId;
  @api selectedOption;
  @track data;
  @track relatedRecord; //* Used for tab 3
  columns = columns;
  loading = true;

  //* Life Cycle methods
  connectedCallback() {
    this.getRelatedRecords();
    this.getFinalChecks();
  }

  renderedCallback() {
    this.setLoading(false);
  }

  //* Getters
  //? Match the 'values' of the radiobutons on the checklist viewer
  get isCloseWin() {
    return this.selectedOption === "closewin";
  }
  get isDocX() {
    return this.selectedOption === "docX";
  }
  get isDocY() {
    return this.selectedOption === "docY";
  }

  //* Data to be rendered at tab 2 (table)
  getRelatedRecords() {
    getContacts({ recordId: this.recordId }).then((result) => {
      this.data = result.map((record) => ({
        ...record,
        //? Map the fields to the ones described on the 'colums' const
        Id: record.Contact__c, //! CHANGE THE ID OF THE JUNCTION OBJECT WITH THE ID OF THE TARGET
        urlId: "/" + record.Contact__c,
        FirstName: record.Contact__r.FirstName,
        LastName: record.Contact__r.LastName,
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
    });
  }

  //* Form Handling
  handleSubmit() {
    this.setLoading(true);
  }

  //* Table Handling
  handleSave(event) {
    this.setLoading(true);
    this.saveDraftValues = event.detail.draftValues;
    console.log(JSON.stringify(this.saveDraftValues));
    saveDraftValues({ data: this.saveDraftValues })
      .then(() => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: "Records updated successfully",
            variant: "success"
          })
        );
        this.draftValues = [];
        //Get the updated list.
        this.getRelatedRecords();
      })
      .catch((error) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error",
            message: JSON.stringify(error),
            variant: "error"
          })
        );
      })
      .finally(() => this.setLoading(false));
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
