import { LightningElement, api, track } from "lwc";

const DEFAULT_FLEX_GRID = "1";
const FLEX_GRID_PREFIX = "0 0 ";
export default class RdImageButtonGroup extends LightningElement {
  @track buttons;
  @api isMultiselect;
  @api orientation = "horizontal";
  @api elementsPerRow;
  isRendered = false;
  @api
  get elements() {
    return this.elements;
  }
  set elements(values) {
    this.buttons = values.map((button) => ({ ...button, selected: false }));
  }

  renderedCallback() {
    if (this.isRendered) return;
    this.isRendered = true;
    let container = this.template.querySelector(".button-group-container");
    container.classList.add(this.orientation);

    if (this.elementsPerRow) {
      let numOfElements = parseInt(this.elementsPerRow, 10);

      let group = this.template.querySelectorAll(".button-group-container");
      let css = this.template.host.style;
      if (!css) return;

      let flex =
        numOfElements > 0
          ? FLEX_GRID_PREFIX + this.getFlexBasis(numOfElements)
          : DEFAULT_FLEX_GRID;

      css.setProperty("--customFlexBasis", flex);
    }
  }

  getFlexBasis(elementsPerRow) {
    const flexBasis = 100 / elementsPerRow;

    return flexBasis.toString() + "%";
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
}
