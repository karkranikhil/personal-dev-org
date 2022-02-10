import { LightningElement, api, track, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import getExistingDocuments from "@salesforce/apex/FileGridUploaderController.getExistingDocuments";

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
      console.log(message);
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
    console.log("Field Labels", fieldLabels);
    console.log("Record", JSON.parse(JSON.stringify(this.record)));
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
          console.log(
            "Field List Updated: ",
            JSON.parse(JSON.stringify(this.fieldApiNamesList))
          );
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
    // console.log("Field to Remove", field);
    // this.fieldApiNamesList = this.fieldApiNamesList.filter((item) => {
    //   return item.apiname !== field;
    // });
    // console.log("Updated List", this.fieldApiNamesList);
  }
}
