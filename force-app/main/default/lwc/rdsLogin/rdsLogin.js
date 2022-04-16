import { LightningElement, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
export default class RdsLogin extends LightningElement {
  @api backgroundColor;
  @api inactiveTabBackgroundColor;
  @api hoverTabBackgroundColor;
  @api tabFontColor;
  @api fontColor;
  @api buttonBackgroundColor;
  @api buttonHoverBackgroundColor;

  expandIcon = "utility:chevrondown";

  isLogin = true;
  isRegister = false;

  renderedCallback() {
    if (!this.hasRendered) {
      //?Change Colors and Height
      let style = this.template.querySelector(".container").style;
      style.setProperty("--color-background", this.backgroundColor);
      style.setProperty(
        "--color-tab-inactive-background",
        this.inactiveTabBackgroundColor
      );
      style.setProperty(
        "--color-tab-hover-background",
        this.hoverTabBackgroundColor
      );
      style.setProperty("--color-tab-text", this.tabFontColor);
      style.setProperty("--color-text", this.fontColor);
      style.setProperty("--color-button", this.buttonBackgroundColor);
      style.setProperty(
        "--color-button-hover",
        this.buttonHoverBackgroundColor
      );
      this.hasRendered = true;
    }
  }

  //*CALLOUTS

  handleLogin(event) {
    event.preventDefault();
    this.validateInputs();
    console.log("Validate Login");
  }
  handleRegister(event) {
    event.preventDefault();
    this.validateInputs();
    console.log("Validate Register");
  }

  validateInputs() {
    const allValid = [
      ...this.template.querySelectorAll("lightning-input")
    ].reduce((validSoFar, inputCmp) => {
      inputCmp.reportValidity();
      return validSoFar && inputCmp.checkValidity();
    }, true);
    if (allValid) {
      console.log("All Valid");
    } else {
      console.log("Invalid inputs");
    }
  }

  //* USER INTERACTION

  handleNav(event) {
    let nav = event.currentTarget;
    if (nav.classList.contains("active")) return;
    let activeNav = this.template.querySelector(".nav-tab.active");
    let phase = nav.getAttribute("data-id");
    switch (phase) {
      case "login":
        this.setLogin();
        break;
      case "register":
        this.setRegister();
        break;

      default:
        this.setLogin();
        break;
    }
    nav.classList.add("active");
    activeNav.classList.remove("active");
  }

  handleCollapse() {
    let collapsible = this.template.querySelector(".collapsible");
    this.expandIcon =
      this.expandIcon === "utility:chevrondown"
        ? "utility:chevronup"
        : "utility:chevrondown";
    if (collapsible.style.maxHeight) {
      collapsible.style.maxHeight = null;
    } else {
      collapsible.style.maxHeight = collapsible.scrollHeight + "px";
    }
  }

  setLogin() {
    this.isLogin = true;
    this.isRegister = false;
  }
  setRegister() {
    this.isLogin = false;
    this.isRegister = true;
  }
}
