import { LightningElement, api } from "lwc";
import ASSETS from "@salesforce/resourceUrl/esComponentAssets";

export default class EsNavigationTile extends LightningElement {
  @api title;
  @api description;
  @api image;
  @api backgroundColor;
  @api shadowColor;
  @api fontColor;
  imagePath;

  connectedCallback() {
    this.imagePath = ASSETS + "/navTiles/" + this.image;
  }
}
