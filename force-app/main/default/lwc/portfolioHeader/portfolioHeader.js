import { LightningElement, track, api } from "lwc";
import getNavigationItems from "@salesforce/apex/esNavigationController.getNavigationItems";

import BASE_PATH from "@salesforce/community/basePath";

import { ShowToastEvent } from "lightning/platformShowToastEvent";

import { NavigationMixin } from "lightning/navigation";

export default class PortfolioHeader extends LightningElement {
  @api textColor;
  @api mainColor;
  @api navigation;
  @track navigationItems = [];
  hasRendered = false;
  isMenuOpen = false;

  connectedCallback() {
    this.setNavigationItems();
  }

  renderedCallback() {
    //?Change Colors and Height
    if (!this.hasRendered) {
      let header = this.template.querySelector("header");
      window.addEventListener("scroll", function () {
        header.classList.toggle("sticky", window.scrollY > 100);
      });
      header.style.setProperty("--textColor", this.textColor);
      header.style.setProperty("--mainColor", this.mainColor);

      let menu = this.template.querySelector(".menu-icon");
      let navlist = this.template.querySelector(".navlist");

      menu.onclick = () => {
        this.isMenuOpen = !this.isMenuOpen;
        navlist.classList.toggle("open");
      };
      window.onscroll = () => {
        menu.classList.remove("bx-x");
        navlist.classList.remove("open");
      };

      this.hasRendered = true;
    }
  }

  navigate(event) {
    event.stopPropagation();

    let id = event.target.name;

    let nav = this.navigationItems.find((item) => item.Id === id);
    if (!nav)
      nav = this.secondaryNavigationItems.find((item) => item.Id === id);

    switch (nav.Type) {
      case "SalesforceObject":
        this.navigateToObject(nav.Target);
        break;
      case "InternalLink":
        window.location.href =
          window.location.origin + "/portal/s/" + nav.Target.replace("/", "");
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
    getNavigationItems({
      NavigationDeveleoperName: this.navigation
    }).then((response) => {
      if (response.length > 6) {
        this.notifyUser(
          "Error",
          "Cannot set more than 6 Navigation Items - " + this.navigation,
          "error"
        );
      } else {
        this.navigationItems = [...response];
      }
    });
  }
}
