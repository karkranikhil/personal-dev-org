import { LightningElement } from "lwc";

export default class EsLookupDemo extends LightningElement {
  data = {
    recordId: "",
    sobject: "",
    uniqueField: "",
    uniqueFieldValue: ""
  };

  handleChange(event) {
    console.log("Change");
    let name = event.target.name;
    let value = event.target.value;
    let copy = { ...this.data };
    copy[name] = value;
    this.data = { ...copy };
  }
  handleSelection(event) {
    this.data = { ...event.detail };
    // eslint-disable-next-line no-alert
    alert(`Your values: \n 
  Record Id: ${this.data.recordId} \n 
  Object: ${this.data.sobject} \n 
  Field: ${this.data.uniqueField} \n 
  Value: ${this.data.uniqueFieldValue} \n 
  `);
  }
}
