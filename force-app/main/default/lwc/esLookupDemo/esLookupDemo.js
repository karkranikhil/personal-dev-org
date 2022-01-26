import { LightningElement } from "lwc";

export default class EsLookupDemo extends LightningElement {
  data = {
    recordId: "",
    sobject: "",
    uniqueField: "",
    uniqueFieldValue: ""
  };

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
}
