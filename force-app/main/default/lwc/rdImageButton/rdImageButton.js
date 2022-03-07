import { LightningElement, api } from "lwc";

export default class RdImageButton extends LightningElement {
  @api id;
  @api isMultiselect;
  @api image = "https://picsum.photos/600?random=1";
  @api theme = "light";
  @api size = "small";
  @api variant = "overlay";
  @api darkColor = "#343a40";
  @api lightColor = "#e9ecef";
  state = false;

  //* GETTERS AND SETTERS
  @api
  get buttonData() {
    return {
      id: this.id,
      state: this.state
    };
  }

  //* LIFECYCLE

  renderedCallback() {
    //? Set background img
    this.template.querySelector(".container").style.backgroundImage =
      "url(" + this.image + ")";

    //?Change Colors and Height
    let r = this.template.querySelector("*");
    r.style.setProperty("--color-light", this.darkColor);
    r.style.setProperty("--color-dark", this.lightColor);

    //? Set classes
    let container = this.template.querySelector(".container");
    container.classList.add(this.theme);
    container.classList.add(this.size);

    let labelContainer = this.template.querySelector(".label-container");
    labelContainer.style.setProperty("--color-light", this.darkColor);
    labelContainer.style.setProperty("--color-dark", this.lightColor);
    labelContainer.classList.add(this.theme);
    labelContainer.classList.add(this.variant);

    let label = this.template.querySelector(".label");

    label.classList.add(this.theme);
    label.classList.add(this.variant);
  }
}
