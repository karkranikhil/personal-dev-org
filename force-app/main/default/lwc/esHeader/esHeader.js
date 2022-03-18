import { LightningElement, api, track, wire } from "lwc";
import getNavigationItems from "@salesforce/apex/esNavigationController.getNavigationItems";
import BASE_PATH from "@salesforce/community/basePath";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
import USER_ID from "@salesforce/user/Id";
import IS_GUEST from "@salesforce/user/isGuest";
import { getRecord } from "lightning/uiRecordApi";
import LANG from "@salesforce/i18n/lang";

export default class EsHeader extends NavigationMixin(LightningElement) {
  @api backgroundColor;
  @api lineColor;
  @api primaryColor;
  @api secondaryColor;
  @api logo;
  @api loggedInBtn;
  @api loggedOutBtn;
  @api mainNavigation;
  @api secondaryNavigation;

  @track mainNavigationItems = [];
  @track secondaryNavigationItems = [];
  isSideOpen = false;
  isSecondaryNavOpen = false;

  userId = USER_ID;
  isGuest = IS_GUEST;
  userName;

  //* LIFE CYCLE

  connectedCallback() {
    this.isDeutsch = LANG === "de" ? true : false;
    this.baseURL = window.location.origin + BASE_PATH;
    this.setNavigationItems();
  }

  renderedCallback() {
    //?Change Colors and Height
    let header = this.template.querySelector(".header");
    let side = this.template.querySelector(".sidenav");
    let secondary = this.template.querySelector(".secondarynav");
    header.style.setProperty("--color-line", this.lineColor);
    header.style.setProperty("--color-primary", this.primaryColor);
    header.style.setProperty("--color-secondary", this.secondaryColor);
    header.style.setProperty("--color-background", this.backgroundColor);

    side.style.setProperty("--color-line", this.lineColor);
    side.style.setProperty("--color-primary", this.primaryColor);
    side.style.setProperty("--color-secondary", this.secondaryColor);
    side.style.setProperty("--color-background", this.backgroundColor);

    secondary.style.setProperty("--color-line", this.lineColor);
    secondary.style.setProperty("--color-primary", this.primaryColor);
    secondary.style.setProperty("--color-secondary", this.secondaryColor);
    secondary.style.setProperty("--color-background", this.backgroundColor);
  }

  @api recordId;

  @wire(getRecord, { recordId: "$userId", fields: ["User.Name"] })
  user;

  @wire(getRecord, { recordId: "$userId", fields: ["User.Name"] })
  wiredUser({ error, data }) {
    if (data) {
      this.userName = data.fields.Name.value;
    }
  }
  //* NAVIGATION

  navigate(event) {
    event.stopPropagation();

    let id = event.target.name;

    let nav = this.mainNavigationItems.find((item) => item.Id === id);
    if (!nav)
      nav = this.secondaryNavigationItems.find((item) => item.Id === id);

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
    getNavigationItems({
      NavigationDeveleoperName: this.mainNavigation
    }).then((response) => {
      if (response.length > 6) {
        this.notifyUser(
          "Error",
          "Cannot set more than 6 Navigation Items - " + this.mainNavigation,
          "error"
        );
      } else {
        this.mainNavigationItems = [...response];
      }
    });
    getNavigationItems({
      NavigationDeveleoperName: this.secondaryNavigation
    }).then((response) => {
      if (response.length > 8) {
        this.notifyUser(
          "Error",
          "Cannot set more than 8 Navigation Items - " +
            this.secondaryNavigation,
          "error"
        );
      } else {
        this.secondaryNavigationItems = [...response];
      }
    });
  }
  //* USER INTERACTION

  toggleSideNav() {
    this.isSideOpen = !this.isSideOpen;
    if (this.isSideOpen) {
      this.isSecondaryNavOpen = false;
      this.template.querySelector(".secondarynav").style.height = "0";
    }
    this.template.querySelector(".sidenav").style.width = this.isSideOpen
      ? "250px"
      : "0";
  }
  toggleSecondaryNav() {
    this.isSecondaryNavOpen = !this.isSecondaryNavOpen;
    if (this.isSecondaryNavOpen) {
      this.isSideOpen = false;
      this.template.querySelector(".sidenav").style.width = "0";
    }
    this.template.querySelector(".secondarynav").style.height = this
      .isSecondaryNavOpen
      ? "auto"
      : "0";
  }
}
