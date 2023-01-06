import { LightningElement, track, api } from "lwc";
import Assets from "@salesforce/resourceUrl/infinityCRMAssets";
import getNavigationItems from "@salesforce/apex/esNavigationController.getNavigationItems";
import BASE_PATH from "@salesforce/community/basePath";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";

export default class InfinityHeader extends LightningElement {
  logo = Assets + "/logo.jpg";
  @api logoUrl;
  @api backgroundColor;
  @api fontColor;
  @api decorationColor;
  @api navigation;

  @track navigationItems;
  imagePath;
  hasRendered = false;
  //* ---------------------- LIFECYCLE METHODS ----------------------//

  connectedCallback() {
    this.baseURL = window.location.origin + BASE_PATH;
    if (this.logoUrl) this.logo = this.logoUrl;
    this.setNavigationItems();
  }

  renderedCallback() {
    if (!this.hasRendered) {
      //?Change Colors and Height
      let header = this.template.querySelector(".header");
      header.style.setProperty("--color-background", this.backgroundColor);
      header.style.setProperty("--color-text", this.fontColor);
      header.style.setProperty("--color-decoration", this.decorationColor);

      this.hasRendered = true;
    }
  }

  //* ---------------------- UTILITY METHODS ------------------------//

  navigate(event) {
    event.stopPropagation();
    event.preventDefault();
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
