import { LightningElement, api } from "lwc";
import ASSETS from "@salesforce/resourceUrl/esComponentAssets";

export default class EsNavigationTile extends LightningElement {
  @api title;
  @api description;
  @api image;
  @api backgroundColor;
  @api backgroundHeight;
  @api shadowColor;
  @api fontColor;
  imagePath;
  hasRendered = false;

  connectedCallback() {
    this.imagePath = ASSETS + "/navTiles/" + this.image;
  }

  renderedCallback() {
    if (!this.hasRendered) {
      //?Change Colors and Height
      this.template.querySelector(".background").style.height =
        this.backgroundHeight;
      let r = this.template.querySelector(".card");
      r.style.setProperty("--color-hover-shadow", this.shadowColor);
      r.style.setProperty("--color-text", this.fontColor);
      r.style.setProperty("--color-background", this.backgroundColor);
      this.hasRendered = true;
    }
  }
}
