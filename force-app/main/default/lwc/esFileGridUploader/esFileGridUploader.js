import { LightningElement, api, track, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import getExistingDocuments from "@salesforce/apex/FileGridUploaderController.getExistingDocuments";
import DOCUMENTS_LABEL from "@salesforce/label/c.esGridFileUploader_DOCUMENTS";
import FILES_LABEL from "@salesforce/label/c.esGridFileUploader_FILES";

const IMG_URL_PREFIX = "/sfc/servlet.shepherd/version/download/";

export default class EsFileGridUploader extends LightningElement {
  //* --------- VARIABLES ---------*//
  @api recordId;
  @api objectApiName;
  @track fieldApiNamesList;
  @api fieldApiNames;
  fields = [this.objectApiName + ".Name"];
  record;
  documents;

  labels = {
    documents: DOCUMENTS_LABEL,
    files: FILES_LABEL
  };
  get isRenderList() {
    return this.record && this.fieldApiNamesList;
  }
  //* --------- LIFE CYCLE ---------*//
  connectedCallback() {
    this.setFieldsApinamesList();
  }
  //* --------- WIRE METHODS ---------*//

  //* GET RECORD DATA
  @wire(getRecord, {
    recordId: "$recordId",
    fields: "$recordFields"
  })
  wiredRecord({ error, data }) {
    if (error) {
      let message = "Unknown error";
      if (Array.isArray(error.body)) {
        message = error.body.map((e) => e.message).join(", ");
      } else if (typeof error.body.message === "string") {
        message = error.body.message;
      }
      console.error(error);
    } else if (data) {
      this.record = data;
      this.getDocs();
    }
  }

  //*GET OBJECT DATA
  @wire(getObjectInfo, { objectApiName: "$objectApiName" })
  objectInfoWire({ error, data }) {
    if (error) {
      console.error(error);
    } else if (data) {
      this.fieldApiNamesList = this.fieldApiNamesList.map((field) => ({
        ...field,
        label: data.fields[field.apiname].label
      }));
      this.getDocs();
    }
  }

  //*GET EXISTING DOCS
  getDocs() {
    let fieldLabels = this.fieldApiNamesList.map((field) => field.label);
    getExistingDocuments({
      recordId: this.recordId,
      recordName: this.record.fields.Name.value,
      fieldLabels: fieldLabels
    })
      .then((response) => {
        if (response && response.length > 0) {
          this.documents = response.map((doc) => ({
            url:
              IMG_URL_PREFIX +
              doc.ContentDocument.LatestPublishedVersionId +
              "?operationContext=S1",
            name: doc.ContentDocument.LatestPublishedVersion.Title,
            extension: doc.ContentDocument.FileExtension
          }));
          this.fieldApiNamesList = this.fieldApiNamesList.map((field) => ({
            ...field,
            documents: this.documents.filter(
              (doc) =>
                doc.name.substring(0, doc.name.indexOf("_")) === field.label
            )
          }));
        }
      })
      .catch((error) => console.error(error));
  }

  //* ---------UTILITY METHODS ---------*//

  setFieldsApinamesList() {
    this.fieldApiNamesList = this.fieldApiNames
      .split(",")
      .map((field) => ({ apiname: field.trim(), label: " " }));
    this.recordFields = [this.objectApiName + ".Name"];
  }

  handleUploaded(event) {
    //! Unccoment if you wish the 'Remove Uploaded' feature
    // let field = event.detail;
    // this.fieldApiNamesList = this.fieldApiNamesList.filter((item) => {
    //   return item.apiname !== field;
    // });
  }
}
