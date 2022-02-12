import { LightningElement, api, track } from "lwc";
import getNavigationItems from "@salesforce/apex/esNavigationController.getNavigationItems";
import BASE_PATH from "@salesforce/community/basePath";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
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

  @track firstLinks;
  @track secondLinks;
  @track fourthLinks;
  @track navigationItems = [];

  //* ---------------------- LIFECYCLE METHODS ----------------------//

  connectedCallback() {
    this.baseURL = window.location.origin + BASE_PATH;
    this.setNavigationItems();
  }

  renderedCallback() {
    //?Change Colors and Height
    this.template.querySelector(".background").style.backgroundColor =
      this.backgroundColor;
    this.template
      .querySelectorAll(".header")
      .forEach((header) => (header.style.color = this.headerColor));
    this.template
      .querySelectorAll(".link")
      .forEach((link) => (link.style.color = this.fontColor));
  }

  //* ---------------------- UTILITY METHODS ------------------------//

  handleCollapse(event) {
    event.stopPropagation();
    let collapsible = event.target;
    console.log(collapsible.classList);
    console.log(window.innerWidth);
    if (!collapsible.classList.contains("header") || window.innerWidth >= 768) {
      return;
    }
    collapsible.classList.toggle("active");
    let content = collapsible.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  }

  navigate(event) {
    event.stopPropagation();
    let id = event.target.name;
    console.log("Clicked Item", id);
    let nav = this.navigationItems.find((item) => item.Id === id);
    console.log("nav: ", JSON.parse(JSON.stringify(nav)));

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
    getNavigationItems({ NavigationDeveleoperName: this.firstNavigation })
      .then((response) => {
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
      })
      .catch((error) => {
        console.error(error);
      });
    getNavigationItems({ NavigationDeveleoperName: this.secondNavigation })
      .then((response) => {
        if (response.length > 8) {
          this.notifyUser(
            "Error",
            "Cannot set more than 8 Navigation Items - " +
              this.secondNavigation,
            "error"
          );
        } else {
          this.secondLinks = [...response];
          this.navigationItems = [...this.navigationItems, ...response];
        }
      })
      .catch((error) => {
        console.error(error);
      });
    getNavigationItems({ NavigationDeveleoperName: this.fourthNavigation })
      .then((response) => {
        if (response.length > 8) {
          this.notifyUser(
            "Error",
            "Cannot set more than 8 Navigation Items - " +
              this.fourthNavigation,
            "error"
          );
        } else {
          this.fourthLinks = [...response];
          this.navigationItems = [...this.navigationItems, ...response];
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
