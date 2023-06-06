import { LightningElement, track, api, wire } from "lwc";
import {
  subscribe,
  unsubscribe,
  MessageContext
} from "lightning/messageService";
import MESSAGE_CHANNEL from "@salesforce/messageChannel/BasketUpdateChannel__c";
import getCount from "@salesforce/apex/CartButtonController.getCount";

export default class CartButton extends LightningElement {
  @api userId;
  @api sessionStorageId;
  @api flowName = "Get_Product_Count_Invokable"; // Default flow name
  @track badgeCount = 0;
  cometdInitialized = false;
  subscription = null;
  channelName = "/event/Add_Product_to_Basket__e";
  cookieName = "artBookingSession";
  cookieVal = "";

  connectedCallback() {
    this.checkCookies();
    this.getBadgeCount();
    this.subscribeToChannel();
  }

  get isDisplayBadge() {
    return this.badgeCount != null && this.badgeCount > 0;
  }

  getBadgeCount() {
    let inputVariables = {
      UserID: this.userId,
      BookingSessionID: this.sessionStorageId
    };

    getCount({ flowName: this.flowName, inputVariables: inputVariables })
      .then((result) => {
        console.log("@@ BadgeCount: ", result);
        this.badgeCount = Math.trunc(result) > 99 ? "+99" : Math.trunc(result);
      })
      .catch((error) => {
        console.error(error.body.message);
      });
  }
  // Cookie Handling Methods

  // Check if there's a valid cookie present, else create a new one
  checkCookies() {
    let result = this.retrieveCookie();
    if (result == "") {
      let newUuid = crypto.randomUUID();
      this.createCookie(this.cookieName, newUuid, 5);
      this.sessionStorageId = newUuid;
    } else {
      this.sessionStorageId = result;
    }
    console.log("@@ UserId", this.userId);
    console.log("@@ BookingSessionId", this.sessionStorageId);
  }

  // Retrieve a cookie
  retrieveCookie() {
    let cookieString = "; " + document.cookie;
    let parts = cookieString.split("; " + this.cookieName + "=");
    return decodeURIComponent(parts.pop().split(";").shift());
  }

  // Create a new cookie
  createCookie(name, value, daysToLive) {
    let expires;
    if (daysToLive) {
      const date = new Date();
      date.setTime(date.getTime() + daysToLive * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toGMTString();
    } else {
      expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  }

  // Delete a cookie
  deleteCookie(cookieName) {
    this.createCookie(cookieName, "", null);
  }

  @wire(MessageContext)
  messageContext;

  subscribeToChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        MESSAGE_CHANNEL,
        (message) => {
          this.handleMessageReceived(message);
        }
      );
    }
  }

  handleMessageReceived(message) {
    console.log("@@messageReceived: ", JSON.parse(JSON.stringify(message)));
    this.getBadgeCount();
  }

  disconnectedCallback() {
    this.unsubscribeFromChannel();
  }

  unsubscribeFromChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }
}
