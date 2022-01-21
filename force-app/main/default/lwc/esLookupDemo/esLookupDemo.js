import { LightningElement } from "lwc";

export default class EsLookupDemo extends LightningElement {
  data = {
    recordId: "0015f00000DlcuSAAR",
    sobject: "Contact",
    uniqueField: "SSN__c",
    uniqueFieldValue: ""
  };

  handleChange(event) {
    let name = event.target.name;
    let value = event.target.value;
    let copy = { ...this.data };
    copy[name] = value;
    this.data = { ...copy };
    console.log(this.data);
  }
}
