import { LightningElement, api } from "lwc";

export default class EsChecklistSelector extends LightningElement {
  @api options;
  @api value;
  //? Handler for the radio group. When changes, sends an event to parent with the selected value in the details
  handleChange(event) {
    const selectedOption = event.detail.value;
    const e = new CustomEvent("select", {
      detail: { selectedOption }
    });
    this.dispatchEvent(e);
  }
}
