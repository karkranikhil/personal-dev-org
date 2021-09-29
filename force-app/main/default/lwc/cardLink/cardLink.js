import { LightningElement, api, track } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import CARD_IMAGES from "@salesforce/resourceUrl/StockImages";

export default class CardLink extends NavigationMixin(LightningElement) {
  @api pageApiName;
  @api image;
  @api title;
  @api description;
  @api callToAction;
  @api color;
  @api hoverColor;

  @track cardImage;

  renderedCallback() {
    if (this.initialised) {
      return;
    }
    this.cardImage = CARD_IMAGES + "/images/" + this.image;
    let card = this.template.querySelector(".card-article ");

    card.style.setProperty("--primary-color", this.color);
    card.style.setProperty("--hover-color", this.hoverColor);
    this.initialised = true;
  }

  navigateToCommunityPage() {
    this[NavigationMixin.Navigate]({
      type: "comm__namedPage",
      attributes: {
        pageName: "Custom Page",
        name: this.pageApiName
      }
    });
  }
}
