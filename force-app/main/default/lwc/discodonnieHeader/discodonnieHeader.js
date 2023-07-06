import { LightningElement, api, track, wire } from "lwc";
import RESOURCES from "@salesforce/resourceUrl/discodonnieResources";
import getNavigationItems from "@salesforce/apex/esNavigationController.getNavigationItems";
import BASE_PATH from "@salesforce/community/basePath";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
import USER_ID from "@salesforce/user/Id";
import IS_GUEST from "@salesforce/user/isGuest";
import { getRecord } from "lightning/uiRecordApi";
export default class DiscodonnieHeader extends NavigationMixin(LightningElement) {
  @track navigationItems = [];
  @api navigation;
  @api recordId;
  hasRendered = false;

  logoUrl = RESOURCES + "/images/logo.png";
  iconSetUrl = RESOURCES + "/images/icons-set.png";
  dividerUrl = RESOURCES + "/images/breadcrumbs.divider.png";

  userId = USER_ID;
  isGuest = IS_GUEST;
  userName;
  hasRendered = false;

  get pageTitle() {
    const pathname = window.location.pathname; // get the path
    const parts = pathname.split("/"); // split the path into parts
    const pageName = parts.includes("s") ? parts[parts.indexOf("s") + 1] : null;
    return pageName;
  }

  @wire(getRecord, { recordId: "$userId", fields: ["User.Name"] })
  wiredUser({ error, data }) {
    if (data) {
      this.userName = data.fields.Name.value;
    }
  }

  //* LIFE CYCLE
  connectedCallback() {
    console.log(this.logoUrl);
    this.baseURL = window.location.origin + BASE_PATH;
    this.setNavigationItems();
  }

  renderedCallback() {
    if (this.hasRendered) {
      return;
    }
    this.hamMenuListeners();
    this.setIconSet();
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

  hamMenuListeners() {
    const header_icon = this.template.querySelector(
      "header .nav-collapse-mobile"
    );
    const header_menu = this.template.querySelector("header ul.menu");
    header_icon.addEventListener("click", () => {
      header_menu.classList.toggle("show");
    });
  }
  setIconSet() {
    let host = this.template.querySelector("*");
    console.log(this.iconSetUrl);
    console.log(this.baseURL);
    host.style.setProperty(
      "--icon-set-url",
      `url(${window.location.origin + this.iconSetUrl})`
    );
    host.style.setProperty(
      "--divider-url",
      `url(${window.location.origin + this.dividerUrl})`
    );
  }
}
