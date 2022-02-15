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

  connectedCallback() {
    this.imagePath = ASSETS + "/navTiles/" + this.image;
  }

  renderedCallback() {
    //?Change Colors and Height
    this.template.querySelector(".background").style.backgroundColor =
      this.backgroundColor;
    this.template.querySelector(".background").style.height =
      this.backgroundHeight;
    this.template.querySelector(".background").style.color = this.fontColor;
    let r = this.template.querySelector("*");
    r.style.setProperty("--color-hover-shadow", this.shadowColor);
  }
}
