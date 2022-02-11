import { LightningElement, api } from "lwc";

export default class EsFooter extends LightningElement {
  @api backgroundColor;
  @api headerColor;
  @api fontColor;
  @api firstHeader;
  @api secondHeader;
  @api thirdHeader;
  @api fourthHeader;
  @api firstNavigation;
  @api secondNavigation;
  @api fourthNavigation;
}
