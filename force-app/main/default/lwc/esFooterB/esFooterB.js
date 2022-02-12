import { LightningElement, api, track } from "lwc";
import getNavigationItems from "@salesforce/apex/esNavigationController.getNavigationItems";
import BASE_PATH from "@salesforce/community/basePath";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
import ASSETS from "@salesforce/resourceUrl/esComponentAssets";

export default class EsFooterB extends NavigationMixin(LightningElement) {
  @api backgroundColor;
  @api fontColor;
  @api icon;
  @api iconLink;
  @api navigation;

  @track navigationItems;
  imagePath;

  //* ---------------------- LIFECYCLE METHODS ----------------------//

  connectedCallback() {
    this.imagePath = ASSETS + "/footer/" + this.icon;
    this.baseURL = window.location.origin + BASE_PATH;
    this.setNavigationItems();
  }

  renderedCallback() {
    //?Change Colors and Height
    this.template.querySelector(".footer").style.backgroundColor =
      this.backgroundColor;
    this.template
      .querySelectorAll(".link")
      .forEach((link) => (link.style.color = this.fontColor));
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
