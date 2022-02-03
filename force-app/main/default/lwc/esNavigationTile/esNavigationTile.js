import { LightningElement, api } from "lwc";

export default class EsNavigationTile extends LightningElement {
  @api title;
  @api description;
  @api imagePath;
  @api navigations;
}
