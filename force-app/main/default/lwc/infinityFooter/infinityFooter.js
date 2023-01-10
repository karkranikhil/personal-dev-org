import { LightningElement, api, track } from "lwc";
import getNavigationItems from "@salesforce/apex/esNavigationController.getNavigationItems";
import BASE_PATH from "@salesforce/community/basePath";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
import Assets from "@salesforce/resourceUrl/infinityCRMAssets";

export default class InfinityFooter extends LightningElement {
  @api backgroundColor;
  @api fontColor;
  @api decorationColor;
  @api icon;
  @api iconLink;
  @api footerText;
  iconUrl = Assets + "/logoIcon.png";
  @track navigationItems;
  imagePath;
  hasRendered = false;
  //* ---------------------- LIFECYCLE METHODS ----------------------//

  connectedCallback() {
    if (this.icon) this.iconUrl = this.icon;
    // this.baseURL = window.location.origin + BASE_PATH;
    // this.setNavigationItems();
  }

  renderedCallback() {
    if (!this.hasRendered) {
      //?Change Colors and Height
      let footer = this.template.querySelector(".footer");
      let decoration = this.template.querySelector(".footer-decoration");
      footer.style.setProperty("--color-background", this.backgroundColor);
      footer.style.setProperty("--color-text", this.fontColor);
      decoration.style.setProperty("--color-decoration", this.decorationColor);

      this.hasRendered = true;
    }
  }

  //* ---------------------- UTILITY METHODS ------------------------//

  navigate(event) {
    event.stopPropagation();
    let id = event.target.name;

    let nav = this.navigationItems.find((item) => item.Id === id);

    switch (nav.Type) {
      case "SalesforceObject":
        this.navigateToObject(nav.Target);
        break;
      case "InternalLink":
        window.location.href += nav.Target.replace("/", "");
        break;
      case "ExternalLink":
        window.location.href = nav.Target;
        break;
      case "Event":
        if (nav.Target === "Logout") {
          this.logout();
        }
        if (nav.Target === "Login") {
          this.login();
        }
        window.location.href = nav.Target;
        break;
      default:
        break;
    }
  }

  navigateToObject(object) {
    this[NavigationMixin.Navigate]({
      type: "standard__objectPage",
      attributes: {
        objectApiName: object,
        actionName: "home"
      }
    });
  }
  logout() {
    this[NavigationMixin.Navigate]({
      type: "comm__loginPage",
      attributes: {
        actionName: "logout"
      }
    });
  }
  login() {
    this[NavigationMixin.Navigate]({
      type: "comm__loginPage",
      attributes: {
        actionName: "login"
      }
    });
  }

  notifyUser(title, message, variant) {
    const toastEvent = new ShowToastEvent({ title, message, variant });
    this.dispatchEvent(toastEvent);
  }

  setNavigationItems() {
    getNavigationItems({ NavigationDeveleoperName: this.navigation }).then(
      (response) => {
        if (response.length > 8) {
          this.notifyUser(
            "Error",
            "Cannot set more than 8 Navigation Items - " + this.navigation,
            "error"
          );
        } else {
          this.navigationItems = [...response];
        }
      }
    );
  }
}
