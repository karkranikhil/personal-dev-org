import { LightningElement, api } from "lwc";
import Assets from "@salesforce/resourceUrl/infinityCRMAssets";

export default class InfinityBanner extends LightningElement {
  donutIcon = Assets + "/donut.svg";
  hasRendered = false;
  @api headline;
  @api subtext;
  @api backgroundColor;
  @api fontColor;
  @api useBackgroundPattern;
  renderedCallback() {
    if (!this.hasRendered) {
      this.applyBannerStyles();
    }
    this.hasRendered = true;
  }

  applyBannerStyles() {
    const banner = this.template.querySelector(".infinity-banner");
    if (this.useBackgroundPattern) {
      banner.style.backgroundImage = `url(${this.donutIcon})`;
    }
    banner.style.setProperty("--color-background", this.backgroundColor);
    banner.style.setProperty("--color-text", this.fontColor);
  }
}
