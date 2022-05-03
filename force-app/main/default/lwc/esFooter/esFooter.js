import { LightningElement, api, track } from "lwc";
import getNavigationItems from "@salesforce/apex/esNavigationController.getNavigationItems";
import BASE_PATH from "@salesforce/community/basePath";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
export default class EsFooter extends NavigationMixin(LightningElement) {
  @api backgroundColor;
  @api headerColor;
  @api fontColor;
  @api firstHeader;
  @api secondHeader;
  @api thirdHeader;
  @api fourthHeader;
  @api firstNavigation;
  @api secondNavigation;
  @api thirdNavigation;
  @api fourthNavigation;

  @track firstLinks;
  @track secondLinks;
  @track thirdLinks;
  @track fourthLinks;
  @track navigationItems = [];

  @track headers = {
    first: {
      icon: "utility:chevrondown"
    },
    second: {
      icon: "utility:chevrondown"
    },
    third: {
      icon: "utility:chevrondown"
    },
    fourth: {
      icon: "utility:chevrondown"
    }
  };

  hasRendered = false;

  //* ---------------------- LIFECYCLE METHODS ----------------------//

  connectedCallback() {
    this.baseURL = window.location.origin + BASE_PATH;
    this.setNavigationItems();
  }

  renderedCallback() {
    if (!this.hasRendered) {
      //?Change Colors and Height
      let r = this.template.querySelector(".container");
      r.style.setProperty("--color-background", this.backgroundColor);
      r.style.setProperty("--color-text", this.fontColor);
      r.style.setProperty("--color-header", this.headerColor);
      this.hasRendered = true;
    }
  }

  //* ---------------------- UTILITY METHODS ------------------------//

  handleCollapse(event) {
    let header = event.currentTarget;
    var headerId = header.id.split("-").shift();
    if (!header.classList.contains("header") || window.innerWidth >= 768) {
      return;
    }
    header.classList.toggle("active");
    if (header.classList.contains("active")) {
      this.headers[headerId].icon = "utility:chevronup";
    } else {
      this.headers[headerId].icon = "utility:chevrondown";
    }
    let content = header.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  }

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
    getNavigationItems({ NavigationDeveleoperName: this.firstNavigation }).then(
      (response) => {
        if (response.length > 8) {
          this.notifyUser(
            "Error",
            "Cannot set more than 8 Navigation Items - " + this.firstNavigation,
            "error"
          );
        } else {
          this.firstLinks = [...response];
          this.navigationItems = [...this.navigationItems, ...response];
        }
      }
    );
    getNavigationItems({
      NavigationDeveleoperName: this.secondNavigation
    }).then((response) => {
      if (response.length > 8) {
        this.notifyUser(
          "Error",
          "Cannot set more than 8 Navigation Items - " + this.secondNavigation,
          "error"
        );
      } else {
        this.secondLinks = [...response];
        this.navigationItems = [...this.navigationItems, ...response];
      }
    });
    getNavigationItems({ NavigationDeveleoperName: this.thirdNavigation }).then(
      (response) => {
        if (response.length > 8) {
          this.notifyUser(
            "Error",
            "Cannot set more than 8 Navigation Items - " + this.thirdNavigation,
            "error"
          );
        } else {
          this.thirdLinks = [...response];
          this.navigationItems = [...this.navigationItems, ...response];
        }
      }
    );
    getNavigationItems({
      NavigationDeveleoperName: this.fourthNavigation
    }).then((response) => {
      if (response.length > 8) {
        this.notifyUser(
          "Error",
          "Cannot set more than 8 Navigation Items - " + this.fourthNavigation,
          "error"
        );
      } else {
        this.fourthLinks = [...response];
        this.navigationItems = [...this.navigationItems, ...response];
      }
    });
  }
}
