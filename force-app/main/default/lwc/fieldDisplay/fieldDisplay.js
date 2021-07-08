import { LightningElement, api } from "lwc";

export default class FieldDisplay extends LightningElement {
  @api objectApiName;
  @api recordId;
  @api fieldApiName;
  @api title = "Card Title";
  currenObjectName;
  currenRecordId;

  connectedCallback() {
    this.currenRecordId = this.recordId;
    this.currenObjectName = this.objectApiName;
  }
}
