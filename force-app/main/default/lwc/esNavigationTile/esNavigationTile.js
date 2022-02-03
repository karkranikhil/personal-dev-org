import { LightningElement, api } from "lwc";
import ASSETS from "@salesforce/resourceUrl/esComponentAssets";

export default class EsNavigationTile extends LightningElement {
  @api title;
  @api description;
  @api imagePath = ASSETS + "/navTiles/Info.jpg";
  @api navigations;
  @api backgroundColor;
  @api fontColor;

  connectedCallback() {
    console.log("NavTile", this.imagePath);
  }
}
