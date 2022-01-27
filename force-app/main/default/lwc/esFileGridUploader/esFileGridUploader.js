import { LightningElement, api, track, wire } from "lwc";
import { getObjectInfo } from "lightning/uiObjectInfoApi";

export default class EsFileGridUploader extends LightningElement {
  //* --------- VARIABLES ---------*//
  @api recordId;
  @api objectApiName;
  @track fieldApiNamesList;
  @api fieldApiNames;
  //* --------- LIFE CYCLE ---------*//
  connectedCallback() {
    this.fieldApiNamesList = this.fieldApiNames
      .split(",")
      .map((field) => ({ apiname: field.trim(), label: " " }));
    console.log(JSON.parse(JSON.stringify(this.fieldApiNamesList)));
  }
  //* --------- WIRE METHODS ---------*//
  @wire(getObjectInfo, { objectApiName: "$objectApiName" })
  objectInfoWire({ error, data }) {
    if (error) {
      console.error(error);
    } else if (data) {
      console.log(JSON.parse(JSON.stringify(data)));
      this.fieldApiNamesList = this.fieldApiNamesList.map((field) => ({
        ...field,
        label: data.fields[field.apiname].label
      }));
      console.log(
        "Updated fieldlist",
        JSON.parse(JSON.stringify(this.fieldApiNamesList))
      );
    }
  }
}
