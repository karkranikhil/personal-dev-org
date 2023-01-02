import { LightningElement } from "lwc";
import Assets from "@salesforce/resourceUrl/portfolioPageAssets";
// Example :- import TRAILHEAD_LOGO from '@salesforce/resourceUrl/trailhead_logo';
export default class PortfolioHeros extends LightningElement {
  imageUrl = Assets + "/MeCircle.png";
  connectedCallback() {
    console.log(this.imageUrl);
  }
}
