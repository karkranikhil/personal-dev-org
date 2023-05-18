import { LightningElement, api, track, wire } from "lwc";
import RESOURCES from "@salesforce/resourceUrl/propernyeResources";
import getNavigationItems from "@salesforce/apex/esNavigationController.getNavigationItems";
import BASE_PATH from "@salesforce/community/basePath";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
import USER_ID from "@salesforce/user/Id";
import IS_GUEST from "@salesforce/user/isGuest";
import { getRecord } from "lightning/uiRecordApi";
export default class PropernyeHeader extends NavigationMixin(LightningElement) {
  @track navigationItems = [];
  @api navigation;
  @api recordId;

  logoUrl = RESOURCES + "/images/logo.png";
  iconUrl = RESOURCES + "/images/fingers.png";
  closeIcon = RESOURCES + "/images/close.svg";
  herosImageUrl = RESOURCES + "/images/proper-header.jpg";

  userId = USER_ID;
  isGuest = IS_GUEST;
  userName;
  hasRendered = false;

  @wire(getRecord, { recordId: "$userId", fields: ["User.Name"] })
  wiredUser({ error, data }) {
    if (data) {
      this.userName = data.fields.Name.value;
    }
  }

  //* LIFE CYCLE
  connectedCallback() {
    this.baseURL = window.location.origin + BASE_PATH;
    this.setNavigationItems();
  }

  //* NAVIGATION

  navigate(event) {
    event.stopPropagation();

    let id = event.currentTarget.name;

    let nav = this.navigationItems.find((item) => item.Id === id);

    switch (nav.Type) {
      case "SalesforceObject":
        this.navigateToObject(nav.Target);
        break;
      case "InternalLink":
        window.location.href =
          window.location.origin + "/s/" + nav.Target.replace("/", "");
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

  navigateToSettings() {
    window.location.href = window.location.origin + "/s/profile/" + this.userId;
  }
  navigateToHome() {
    this[NavigationMixin.Navigate]({
      type: "comm__namedPage",
      attributes: {
        name: "Home"
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
      if (response.length > 8) {
        this.notifyUser(
          "Error",
          "Cannot set more than 8 Navigation Items - " + this.navigation,
          "error"
        );
      } else {
        this.navigationItems = response.map((navItem) => ({
          ...navItem,
          isCart: navItem.Label.toLowerCase() === "cart"
        }));
      }
    });
  }

  //* USER INTERACTION

  openSideNav() {
    const openHamMenu = this.template.querySelector(".oxy-menu-toggle");
    const mobileMenuIcon = this.template.querySelector(".mobile__menuWrap");
    mobileMenuIcon.classList.add("open");
    openHamMenu.classList.add("close");
  }
  closeSideNav() {
    const openHamMenu = this.template.querySelector(".oxy-menu-toggle");
    const mobileMenuIcon = this.template.querySelector(".mobile__menuWrap");
    mobileMenuIcon.classList.remove("open");
    openHamMenu.classList.remove("close");
  }
}