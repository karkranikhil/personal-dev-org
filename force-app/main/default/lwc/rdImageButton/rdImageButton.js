import { LightningElement, api } from "lwc";
import FORM_FACTOR from "@salesforce/client/formFactor";
export default class RdImageButton extends LightningElement {
  @api buttonId;
  @api isMultiselect;
  @api image;
  @api theme = "light";
  @api size = "small";
  @api variant = "overlay";
  @api label;
  darkColorValue = "#343a40";
  lightColorValue = "#e9ecef";
  selected = false;

  get darkColor() {
    return this.darkColorValue;
  }
  @api
  set darkColor(value) {
    this.darkColorValue = value ? value : "#343a40";
  }
  get lightColor() {
    return this.lightColorValue;
  }
  @api
  set lightColor(value) {
    this.lightColorValue = value ? value : "#e9ecef";
  }

  @api setButtonState(state) {
    this.selected = state;
    let container = this.template.querySelector(".container");
    if (state) {
      container.classList.add("active");
    } else {
      container.classList.remove("active");
    }
  }

  //* LIFECYCLE

  renderedCallback() {
    //? Set icon size based on form factor
    this.iconSize = FORM_FACTOR.toLocaleLowerCase();
    //? Set background img
    if (this.image) {
      this.template.querySelector(".container").style.backgroundImage =
        "url(" + this.image + ")";
    }

    //?Change Colors and Height
    let r = this.template.querySelector("*");
    r.style.setProperty("--color-light", this.lightColor);
    r.style.setProperty("--color-dark", this.darkColor);

    //? Set classes
    let container = this.template.querySelector(".container");
    container.classList.add(this.theme);
    container.classList.add(this.size);

    let labelContainer = this.template.querySelector(".label-container");
    labelContainer.style.setProperty("--color-light", this.lightColor);
    labelContainer.style.setProperty("--color-dark", this.darkColor);
    labelContainer.classList.add(this.theme);
    labelContainer.classList.add(this.variant);

    let label = this.template.querySelector(".label");
    label.classList.add(this.size);
    label.classList.add(this.theme);
    label.classList.add(this.variant);
  }

  //*UTILITY

  toggleState() {
    this.selected = !this.selected;
    this.template.querySelector(".container").classList.toggle("active");
    const event = new CustomEvent("toggle", {
      detail: {
        id: this.buttonId,
        selected: this.selected
      }
    });
    this.dispatchEvent(event);
  }
}
