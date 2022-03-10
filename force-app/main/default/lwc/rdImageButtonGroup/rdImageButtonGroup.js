import { LightningElement, api, track } from "lwc";

export default class RdImageButtonGroup extends LightningElement {
  @track buttons;
  @api isMultiselect;
  @api orientation = "horizontal";
  @api
  get elements() {
    return this.elements;
  }
  set elements(values) {
    this.buttons = values.map((button) => ({ ...button, selected: false }));
  }
  handleToggle(event) {
    let buttonId = event.detail.id;
    console.log("Toggle", buttonId);
    let state = event.detail.selected;
    this.buttons.find((element) => (element.id = buttonId)).selected = state;
    let details = this.buttons.map((button) => ({
      id: button.id,
      state: button.selected
    }));
    const select = new CustomEvent("select", {
      detail: details
    });
    this.dispatchEvent(select);
  }

  renderedCallback() {
    //? Set classes
    let container = this.template.querySelector(".button-group-container");
    container.classList.add(this.orientation);
  }
}
