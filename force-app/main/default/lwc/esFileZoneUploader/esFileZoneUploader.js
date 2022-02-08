import { LightningElement, api } from "lwc";
import { updateRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import TITLE_FIELD from "@salesforce/schema/ContentDocument.Title";
import ID_FIELD from "@salesforce/schema/ContentDocument.Id";
export default class EsFileZoneUploader extends LightningElement {
  @api recordId;
  @api recordName;
  @api fieldApiName;
  @api fieldLabel;
  @api objectApiName;

  handleUploadFinished(event) {
    // Get the list of uploaded files
    const uploadedFiles = event.detail.files;
    let documentId = uploadedFiles[0].documentId;

    this.updateDocument(documentId);
  }

  updateDocument(documentId) {
    const fields = {};
    fields[ID_FIELD.fieldApiName] = documentId;
    fields[TITLE_FIELD.fieldApiName] = this.fieldLabel + "_" + this.recordName;
    const recordInput = { fields };

    updateRecord(recordInput)
      .then(() => {
        this.updateField();
      })
      .catch((error) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error Uploading File",
            message: error.body.message,
            variant: "error"
          })
        );
      });
  }

  updateField() {
    const fields = {};
    fields.Id = this.recordId;
    fields[this.fieldApiName] = true;
    const recordInput = { fields };
    updateRecord(recordInput)
      .then(() => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: "File Uploaded",
            variant: "success"
          })
        );

        const e = new CustomEvent("uploaded", {
          detail: this.fieldApiName
        });
        this.dispatchEvent(e);
      })
      .catch((error) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error Updating Record",
            message: error.body.message,
            variant: "error"
          })
        );
      });
  }
}
