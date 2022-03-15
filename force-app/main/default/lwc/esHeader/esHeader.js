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
  @api mainNavigation;
  @api sideNavigation;

  isSideOpen = false;

  connectedCallback() {
    this.baseURL = window.location.origin + BASE_PATH;
    //this.setNavigationItems();
  }

  //* USER INTERACTION

  toggleSideNav() {
    this.isSideOpen = !this.isSideOpen;
    this.template.querySelector(".sidenav").style.width = this.isSideOpen
      ? "250px"
      : "0";
  }
}
