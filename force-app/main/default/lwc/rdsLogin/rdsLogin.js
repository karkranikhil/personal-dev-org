import { LightningElement, api, track } from "lwc";
import siteLogin from "@salesforce/apex/RdsLoginController.login";
import siteRegister from "@salesforce/apex/RdsLoginController.registerUser";
import resetPassword from "@salesforce/apex/RdsLoginController.resetPassword";
import isEmailExist from "@salesforce/apex/RdsLoginController.isEmailExist";
import basePath from "@salesforce/community/basePath";
import isGuest from "@salesforce/user/isGuest";
import { NavigationMixin } from "lightning/navigation";

//*LABELS
import CUSTOM_LOGIN_ERROR_MESSAGE_EMAIL_PASSWORD_RESET_MISSING from "@salesforce/label/c.CUSTOM_LOGIN_ERROR_MESSAGE_EMAIL_PASSWORD_RESET_MISSING";
import CUSTOM_LOGIN_ERROR_MESSAGE_PASSWORD_RESET_NO_USER_FOUND from "@salesforce/label/c.CUSTOM_LOGIN_ERROR_MESSAGE_PASSWORD_RESET_NO_USER_FOUND";
import CUSTOM_LOGIN_ERROR_MESSAGE_PASSWORDS_DONT_MATCH from "@salesforce/label/c.CUSTOM_LOGIN_ERROR_MESSAGE_PASSWORDS_DONT_MATC";
import CUSTOM_LOGIN_ERROR_MESSAGE_REGISTRATION_GENERIC_ERROR from "@salesforce/label/c.CUSTOM_LOGIN_ERROR_MESSAGE_REGISTRATION_GENERIC_ERROR";
import CUSTOM_LOGIN_ERROR_MESSAGE_REGISTRATION_USERNAME_TAKEN from "@salesforce/label/c.CUSTOM_LOGIN_ERROR_MESSAGE_REGISTRATION_USERNAME_TAKEN";
import CUSTOM_LOGIN_FORGOT_PASSWORD from "@salesforce/label/c.CUSTOM_LOGIN_FORGOT_PASSWORD";
import CUSTOM_LOGIN_LOADING_BUTTON_LABEL from "@salesforce/label/c.CUSTOM_LOGIN_LOADING_BUTTON_LABEL";
import CUSTOM_LOGIN_LOGIN_BUTTON_LABEL from "@salesforce/label/c.CUSTOM_LOGIN_LOGIN_BUTTON_LABEL";
import CUSTOM_LOGIN_LOGIN_TAB_SUBTITLE from "@salesforce/label/c.CUSTOM_LOGIN_LOGIN_TAB_SUBTITLE";
import CUSTOM_LOGIN_LOGIN_TAB_TITLE from "@salesforce/label/c.CUSTOM_LOGIN_LOGIN_TAB_TITLE";
import CUSTOM_LOGIN_LOGIN_TITLE from "@salesforce/label/c.CUSTOM_LOGIN_LOGIN_TITLE";
import CUSTOM_LOGIN_PASSWORD_RESET_ACTION from "@salesforce/label/c.CUSTOM_LOGIN_PASSWORD_RESET_ACTION";
import CUSTOM_LOGIN_REGISTER_BUTTON_LABEL from "@salesforce/label/c.CUSTOM_LOGIN_REGISTER_BUTTON_LABEL";
import CUSTOM_LOGIN_REGISTER_TAB_SUBTITLE from "@salesforce/label/c.CUSTOM_LOGIN_REGISTER_TAB_SUBTITLE";
import CUSTOM_LOGIN_REGISTER_TAB_TITLE from "@salesforce/label/c.CUSTOM_LOGIN_REGISTER_TAB_TITLE";
import CUSTOM_LOGIN_REGISTER_TITLE from "@salesforce/label/c.CUSTOM_LOGIN_REGISTER_TITLE";
import CUSTOM_LOGIN_SUCCESS_MESSAGE_PASSWORD_RESET_SUCCESS from "@salesforce/label/c.CUSTOM_LOGIN_SUCCESS_MESSAGE_PASSWORD_RESET_SUCCESS";
import CUSTOM_LOGIN_SUCCESS_MESSAGE_REGISTRATION from "@salesforce/label/c.CUSTOM_LOGIN_SUCCESS_MESSAGE_REGISTRATION";
import CUSTOM_LOGIN_EMAIL from "@salesforce/label/c.CUSTOM_LOGIN_EMAIL";
import CUSTOM_LOGIN_PASSWORD from "@salesforce/label/c.CUSTOM_LOGIN_PASSWORD";
import CUSTOM_LOGIN_FIRST_NAME from "@salesforce/label/c.CUSTOM_LOGIN_FIRST_NAME";
import CUSTOM_LOGIN_LAST_NAME from "@salesforce/label/c.CUSTOM_LOGIN_LAST_NAME";

const ERROR_MESSAGE_EMAIL_PASSWORD_RESET_MISSING =
  CUSTOM_LOGIN_ERROR_MESSAGE_EMAIL_PASSWORD_RESET_MISSING;
const SUCCESS_MESSAGE_PASSWORD_RESET_SUCCESS =
  CUSTOM_LOGIN_SUCCESS_MESSAGE_PASSWORD_RESET_SUCCESS;
const ERROR_MESSAGE_PASSWORD_RESET_NO_USER_FOUND =
  CUSTOM_LOGIN_ERROR_MESSAGE_PASSWORD_RESET_NO_USER_FOUND;
const ERROR_MESSAGE_PASSWORDS_DONT_MATCH =
  CUSTOM_LOGIN_ERROR_MESSAGE_PASSWORDS_DONT_MATCH;
const ERROR_MESSAGE_REGISTRATION_GENERIC_ERROR =
  CUSTOM_LOGIN_ERROR_MESSAGE_REGISTRATION_GENERIC_ERROR;
const ERROR_MESSAGE_REGISTRATION_USERNAME_TAKEN =
  CUSTOM_LOGIN_ERROR_MESSAGE_REGISTRATION_USERNAME_TAKEN;
const SUCCESS_MESSAGE_REGISTRATION = CUSTOM_LOGIN_SUCCESS_MESSAGE_REGISTRATION;

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
  isLoading = false;
  message = null;
  alertClasses = "alert alert-danger alert-text";
  @track credentials = {
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    confirmPassword: null,
    username: null
  };

  label = {
    forgotPassword: CUSTOM_LOGIN_FORGOT_PASSWORD,
    loading: CUSTOM_LOGIN_LOADING_BUTTON_LABEL,
    login: CUSTOM_LOGIN_LOGIN_BUTTON_LABEL,
    loginTabSubtitle: CUSTOM_LOGIN_LOGIN_TAB_SUBTITLE,
    loginTabTitle: CUSTOM_LOGIN_LOGIN_TAB_TITLE,
    loginTitle: CUSTOM_LOGIN_LOGIN_TITLE,
    resetPasswordAction: CUSTOM_LOGIN_PASSWORD_RESET_ACTION,
    register: CUSTOM_LOGIN_REGISTER_BUTTON_LABEL,
    registerTabSubtitle: CUSTOM_LOGIN_REGISTER_TAB_SUBTITLE,
    registerTabTitle: CUSTOM_LOGIN_REGISTER_TAB_TITLE,
    registerTitle: CUSTOM_LOGIN_REGISTER_TITLE,
    email: CUSTOM_LOGIN_EMAIL,
    password: CUSTOM_LOGIN_PASSWORD,
    firstName: CUSTOM_LOGIN_FIRST_NAME,
    lastName: CUSTOM_LOGIN_LAST_NAME
  };

  connectedCallback() {
    this.startUrl = basePath.substring(0, basePath.lastIndexOf("/"));
    let isBuilder = window.location.href.includes("livepreview");

    if (!isGuest && !isBuilder) {
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
    this.isLoading = true;
    this.message = null;
    let action = event.target.name;

    this.validateInputs(action);
  }

  login() {
    this.isLoading = true;
    siteLogin({
      email: this.credentials.email,
      password: this.credentials.password,
      startUrl: this.startUr
    })
      .then((callbackUrl) => {
        window.location.href = callbackUrl;
      })
      .catch((error) => {
        this.setMessage(error.body.message, "error");
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  register() {
    siteRegister({
      firstName: this.credentials.firstName,
      lastName: this.credentials.lastName,
      username: this.credentials.username,
      email: this.credentials.email,
      password: this.credentials.password
    })
      .then((response) => {
        console.log("response: ", response);
        if (response === "Success") {
          this.setMessage(SUCCESS_MESSAGE_REGISTRATION, "success");
          // eslint-disable-next-line @lwc/lwc/no-async-operation
          // setTimeout(() => {
          //   this.login();
          // }, 3000); //! This is for auto login
        } else {
          this.setMessage(ERROR_MESSAGE_REGISTRATION_GENERIC_ERROR, "error");
        }
      })
      .catch((error) => {
        console.log(JSON.parse(JSON.stringify(error)));
        if (error.body.message === "Username already exists")
          this.setMessage(ERROR_MESSAGE_REGISTRATION_USERNAME_TAKEN, "error");
      })
      .finally(() => {
        this.isLoading = false;
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
      this.setMessage(ERROR_MESSAGE_EMAIL_PASSWORD_RESET_MISSING, "error");
      return;
    }
    isEmailExist({ username: email }).then((isExisting) => {
      if (isExisting) {
        resetPassword({ email: email })
          .then((isReset) => {
            if (isReset) {
              this.setMessage(
                SUCCESS_MESSAGE_PASSWORD_RESET_SUCCESS,
                "success"
              );
            }
          })
          .catch((error) => {
            this.setMessage(error.body.message, "error");
          });
      } else {
        this.setMessage(ERROR_MESSAGE_PASSWORD_RESET_NO_USER_FOUND, "error");
      }
    });
  }

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
        input.setCustomValidity(ERROR_MESSAGE_PASSWORDS_DONT_MATCH);
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
      confirmPassword: null
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
      confirmPassword: null
    };
  }
}
