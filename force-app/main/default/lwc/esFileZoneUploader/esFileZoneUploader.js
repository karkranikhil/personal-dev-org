import { LightningElement, api } from "lwc";
import { updateRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import TITLE_FIELD from "@salesforce/schema/ContentDocument.Title";
import ID_FIELD from "@salesforce/schema/ContentDocument.Id";
export default class EsFileZoneUploader extends LightningElement {
  @api recordId;
  @api fieldApiName;
  @api fieldLabel;
  @api objectApiName;

  handleUploadFinished(event) {
    // Get the list of uploaded files
    const uploadedFiles = event.detail.files;
    console.log(uploadedFiles);
    let documentId = uploadedFiles[0].documentId;
    const fields = {};
    fields[ID_FIELD.fieldApiName] = documentId;
    fields[TITLE_FIELD.fieldApiName] = this.fieldLabel;
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
}
