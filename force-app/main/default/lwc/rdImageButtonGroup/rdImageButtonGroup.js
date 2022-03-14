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
    let state = event.detail.selected;
    this.buttons.find((element) => element.id === buttonId).selected = state;
    if (!this.isMultiselect) {
      this.buttons
        .filter((element) => element.id !== buttonId)
        .forEach((element) => {
          element.selected = false;
          this.template
            .querySelector(`c-rd-image-button.${element.id}`)
            .setButtonState(false);
        });
    }
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
