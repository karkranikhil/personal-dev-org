import { LightningElement } from "lwc";

export default class EsLookupDemo extends LightningElement {
  // data = {
  //   recordId: "0015f00000DlcuTAAR",
  //   sobject: "Account",
  //   uniqueField: "SSN__c",
  //   uniqueFieldValue: "Wint"
  // };
  data = {
    recordId: "",
    sobject: "",
    uniqueField: "",
    uniqueFieldValue: "",
    objectNameFieldMapping: [
      {
        sobject: "Account",
        fallbackSearchField: "AccountNumber"
      }
    ]
  };

  showLookup = false;

  handleChange(event) {
    let name = event.target.name;
    let value = event.target.value;
    let copy = { ...this.data };
    copy[name] = value;
    this.data = { ...copy };
  }
  handleSelection(event) {
    console.log("Received From Child", { ...event.detail });
    this.data = { ...event.detail };
    // eslint-disable-next-line no-alert
  }
  handleInitialize(event) {
    let checked = event.target.checked;
    this.showLookup = checked;
  }
}
