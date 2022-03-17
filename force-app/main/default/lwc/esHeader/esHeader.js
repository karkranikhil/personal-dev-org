import { LightningElement, api, track } from "lwc";
import getNavigationItems from "@salesforce/apex/esNavigationController.getNavigationItems";
import BASE_PATH from "@salesforce/community/basePath";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";

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

  isSideOpen = false;
  isSecondaryNavOpen = false;
  connectedCallback() {
    this.baseURL = window.location.origin + BASE_PATH;
    //this.setNavigationItems();
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
  //* USER INTERACTION

  toggleSideNav() {
    this.isSideOpen = !this.isSideOpen;
    this.template.querySelector(".sidenav").style.width = this.isSideOpen
      ? "250px"
      : "0";
  }
  toggleSecondaryNav() {
    this.isSecondaryNavOpen = !this.isSecondaryNavOpen;
    this.template.querySelector(".secondarynav").style.height = this
      .isSecondaryNavOpen
      ? "auto"
      : "0";
  }
}
