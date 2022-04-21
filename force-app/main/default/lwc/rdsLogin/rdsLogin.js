import { LightningElement, api, track } from "lwc";
import siteLogin from "@salesforce/apex/RdsLoginController.login";
import resetPassword from "@salesforce/apex/RdsLoginController.resetPassword";
import isEmailExist from "@salesforce/apex/RdsLoginController.isEmailExist";
import basePath from "@salesforce/community/basePath";
import isGuest from "@salesforce/user/isGuest";
import { NavigationMixin } from "lightning/navigation";
import Email from "@salesforce/schema/Contact.Email";

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
  alertClasses = "alert alert-danger alert-text";
  @track credentials = {
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    confirmPassword: null
  };

  connectedCallback() {
    this.startUrl = basePath.substring(0, basePath.lastIndexOf("/"));
    if (!isGuest) {
      window.location.href = this.startUrl;
    }
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
        this.setMessage(error.body.message, "error");
      });
  }

  forgotPassword(event) {
    event.preventDefault();
    this.message = null;
    let input = this.template.querySelector("input[data-id='reset-password']");
    let email = input.value;
    let valid = input.reportValidity();
    if (!valid) return;
    if (email === null || email.length === 0) {
      this.setMessage(
        "Please enter your email to reset your password ",
        "error"
      );
      return;
    }
    isEmailExist({ username: email }).then((isExisting) => {
      if (isExisting) {
        resetPassword({ email: email }).then((isReset) => {
          if (isReset) {
            this.setMessage(
              "Check your email to complete your password reset.",
              "success"
            );
          }
        });
      } else {
        this.setMessage(
          "Unfortunately that email address is not registered with us.",
          "error"
        );
      }
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

  setMessage(message, variant) {
    this.message = message;
    switch (variant) {
      case "error":
        this.alertClasses = "alert alert-danger alert-text";
        break;
      case "success":
        this.alertClasses = "alert alert-success alert-text";
        break;

      default:
        this.alertClasses = "alert alert-danger alert-text";
        break;
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
