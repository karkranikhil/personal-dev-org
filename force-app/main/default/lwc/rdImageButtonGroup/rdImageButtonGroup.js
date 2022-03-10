import { LightningElement, api, track } from "lwc";

export default class RdImageButtonGroup extends LightningElement {
  @track buttons;
  @api isMultiselect;
  @api
  get elements() {
    return this.elements;
  }
  set elements(values) {
    console.log(JSON.parse(JSON.stringify(values)));
    this.buttons = values.map((button) => ({ ...button, selected: false }));
  }
  handleTogge(event) {
    let buttonId = event.detail.id;
    let state = event.detail.selected;
    this.buttons.find((element) => (element.buttonId = buttonId)).selected =
      state;
  }
}
