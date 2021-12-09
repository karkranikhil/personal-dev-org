import { LightningElement } from "lwc";

export default class EsChecklistSelector extends LightningElement {
  options = [
    { label: "Close Win Checklist", value: "closewin" },
    { label: "Document X Checklist", value: "docX" },
    { label: "Document Y Checklist", value: "docY" }
  ];

  //! Select option1 by default
  value = "closewin";

  //? Handler for the radio group. When changes, sends an event to parent with the selected value in the details
  handleChange(event) {
    const selectedOption = event.detail.value;
    const e = new CustomEvent("select", {
      detail: { selectedOption }
    });
    this.dispatchEvent(e);
    console.log("Option selected with value: " + selectedOption);
  }
}
