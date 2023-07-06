import { LightningElement } from "lwc";
import RESOURCES from "@salesforce/resourceUrl/discodonnieResources";

export default class DiscodonnieFooter extends LightningElement {
  footerLogo = RESOURCES + "/images/footer-logo.png";
  secondaryLogo = RESOURCES + "/images/logo-see-tickets.png";
  facebookIcon = RESOURCES + "/images/f.png";
  facebookIconHover = RESOURCES + "/images/f_hover.png";
  twitterIcon = RESOURCES + "/images/t.png";
  twitterIconHover = RESOURCES + "/images/t_hover.png";
  youtubeIcon = RESOURCES + "/images/y.png";
  youtubeIconHover = RESOURCES + "/images/y_hover.png";
  googleIcon = RESOURCES + "/images/g.png";
  googleIconHover = RESOURCES + "/images/g_hover.png";

  hasRendered = false;

  renderedCallback() {
    if (this.hasRendered) {
      return;
    }
    this.setIconSet();
    this.hasRendered = true;
  }

  setIconSet() {
    let host = this.template.querySelector("*");

    host.style.setProperty(
      "--f-image",
      `transparent url(${window.location.origin + this.facebookIcon})`
    );
    host.style.setProperty(
      "--f-hover-image",
      `transparent url(${window.location.origin + this.facebookIconHover})`
    );
    host.style.setProperty(
      "--t-image",
      `transparent url(${window.location.origin + this.twitterIcon})`
    );
    host.style.setProperty(
      "--t-hover-image",
      `transparent url(${window.location.origin + this.twitterIconHover})`
    );
    host.style.setProperty(
      "--y-image",
      `transparent url(${window.location.origin + this.youtubeIcon})`
    );
    host.style.setProperty(
      "--y-hover-image",
      `transparent url(${window.location.origin + this.youtubeIconHover})`
    );
    host.style.setProperty(
      "--g-image",
      `transparent url(${window.location.origin + this.googleIcon})`
    );
    host.style.setProperty(
      "--g-hover-image",
      `transparent url(${window.location.origin + this.googleIconHover})`
    );
  }
}
