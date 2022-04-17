import { LightningElement, api, track } from "lwc";
import siteLogin from "@salesforce/apex/RdsLoginController.login";
import basePath from "@salesforce/community/basePath";
import isGuest from "@salesforce/user/isGuest";
import { NavigationMixin } from "lightning/navigation";

export default class RdsLogin extends NavigationMixin(LightningElement) {
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
  message = null;

  @track credentials = {
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    confirmPassword: null
  };

  connectedCallback() {
    console.log(isGuest);
    console.log("basePath: ", basePath);
    this.startUrl = basePath.substring(0, basePath.lastIndexOf("/"));
    console.log("startUrl: ", this.startUrl);
  }

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

  handleSubmit(event) {
    event.preventDefault();
    this.message = null;
    let action = event.target.name;
    console.log(JSON.parse(JSON.stringify(this.credentials)));
    this.validateInputs(action);
  }

  login() {
    siteLogin({
      email: this.credentials.email,
      password: this.credentials.password,
      startUrl: this.startUr
    })
      .then((response) => {
        window.location.href = response;
      })
      .catch((error) => {
        this.message = error.body.message;
      });
  }

  register() {}

  //* INPUT VALIDATION
  validateInputs(action) {
    const allValid = [
      ...this.template.querySelectorAll("lightning-input")
    ].reduce((validSoFar, inputCmp) => {
      inputCmp.reportValidity();
      return validSoFar && inputCmp.checkValidity();
    }, true);
    if (allValid) {
      switch (action) {
        case "login":
          this.login();
          break;
        case "register":
          this.register();
          break;
        default:
          break;
      }
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
      collapsible.style.maxHeight = collapsible.scrollHeight + 1 + "px";
    }
  }

  handleInputChange(event) {
    let name = event.target.name;
    let value = event.target.value.trim();
    this.credentials[name] = value;

    if (name === "confirmPassword") {
      let input = event.target;
      if (value !== this.credentials.password) {
        input.setCustomValidity("Password do not match");
      } else {
        input.setCustomValidity(""); // if there was a custom error before, reset it
      }
      input.reportValidity();
    }
  }

  setLogin() {
    this.isLogin = true;
    this.isRegister = false;
    this.message = null;
    this.credentials = {
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      passwordConfirm: null
    };
  }
  setRegister() {
    this.isLogin = false;
    this.isRegister = true;
    this.message = null;
    this.credentials = {
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      passwordConfirm: null
    };
  }
}
