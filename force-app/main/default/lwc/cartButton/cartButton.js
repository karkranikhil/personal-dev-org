import { LightningElement, track, api } from "lwc";
import getCount from "@salesforce/apex/CartButtonController.getCount";

export default class CartButton extends LightningElement {
  @api userId;
  @api sessionStorageId;
  @api flowName = "Get_Product_Count_Invokable"; // Default flow name
  @track badgeCount = 0;

  cookieName = "artSessionStorageId";
  cookieVal = "";

  connectedCallback() {
    this.checkCookies();
    this.getBadgeCount();
  }

  get isDisplayBadge() {
    return this.badgeCount != null;
    // return this.badgeCount != null && this.badgeCount > 0;
  }
  getBadgeCount() {
    let inputVariables = {
      userID: this.userId,
      sessionID: this.sessionStorageId
    };
    console.log("@@ inputVariables: ", inputVariables);

    getCount({ flowName: this.flowName, inputVariables: inputVariables })
      .then((result) => {
        console.log("@@ Cart Count: ", result);
        this.badgeCount = Math.trunc(result);
      })
      .catch((error) => {
        console.error(error.body.message);
      });
  }

  //* Coockie Session Logic

  checkCookies() {
    var result = this.retrieveCookie();

    if (result == "") {
      var newUuid = crypto.randomUUID();
      this.createCookie(this.cookieName, newUuid, 5);
      this.sessionStorageId = newUuid;
    } else {
      this.sessionStorageId = result;
    }
  }

  retrieveCookie() {
    console.log(document.cookie);

    var cookieString = "; " + document.cookie;
    var parts = cookieString.split("; " + this.cookieName + "=");
    return decodeURIComponent(parts.pop().split(";").shift());
  }

  createCookie(name, value, daysToLive) {
    var expires;

    if (daysToLive) {
      const date = new Date();
      date.setTime(date.getTime() + daysToLive * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toGMTString();
    } else {
      expires = "";
    }

    document.cookie = name + "=" + value + expires + "; path=/";
  }

  deleteCookie(cookieName) {
    this.createCookie(cookieName, "", null);
  }
}
