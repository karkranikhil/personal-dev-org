import { LightningElement } from "lwc";
import Assets from "@salesforce/resourceUrl/infinityCRMAssets";

export default class InfinityBanner extends LightningElement {
  donutIcon = Assets + "/donut.svg";
  hasRendered = false;
  renderedCallback() {
    if (!this.hasRendered) {
      const banner = this.template.querySelector(".infinity-banner");
      console.log("banner: ", JSON.parse(JSON.stringify(banner)));

      banner.style.backgroundImage = `url(${this.donutIcon})`;
      console.log("banner.style: ", banner.style);
    }
    this.hasRendered = true;
  }
}
