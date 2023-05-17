import { LightningElement, track, api } from "lwc";
import {
  subscribe,
  unsubscribe,
  onError,
  setDebugFlag,
  isEmpEnabled
} from "lightning/empApi";
import getCount from "@salesforce/apex/CartButtonController.getCount";

export default class CartButton extends LightningElement {
  // Public properties
  @api userId;
  @api sessionStorageId;
  @api flowName = "Get_Product_Count_Invokable"; // Default flow name

  // Tracked properties
  @track badgeCount = 0;

  // Constants
  cookieName = "artSessionStorageId";
  eventChannel = "/event/Add_Product_to_Basket__e";

  // Variables
  subscription = {};

  // Executed when component is inserted into the DOM - lifecycle hook
  connectedCallback() {
    // Cookie handling
    this.checkCookies();
    // Get initial badge count
    this.getBadgeCount();
    // Register error listener for platform event
    this.registerErrorListener();
    // Subscribe to platform event
    this.subscribeToPlatformEvent();
  }

  // Executed when component is removed from the DOM - lifecycle hook
  disconnectedCallback() {
    // Unsubscribe from the platform event
    this.unsubscribeFromPlatformEvent();
  }

  // Getter to determine if badge should be displayed
  get isDisplayBadge() {
    return this.badgeCount != null && this.badgeCount > 0;
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

  // Platform Event Methods

  // Message handler
  handleMessage(data) {
    const eventFields = data.payload;
    if (
      eventFields.UserID__c === this.userId ||
      eventFields.Booking_Session_ID__c === this.sessionStorageId
    ) {
      // Re-fetch the badge count on valid event
      this.getBadgeCount();
    }
  }

  // Subscribe to the platform event
  subscribeToPlatformEvent() {
    // Callback invoked whenever a new event message is received
    const messageCallback = (response) => {
      console.log("New message received: ", JSON.stringify(response));
      // Handle the event message
      this.handleMessage(response);
    };
    // Subscribe to the platform event
    console.log("Executing subscribe", this.eventChannel);
    subscribe(this.eventChannel, -1, messageCallback)
      .then((response) => {
        console.log(
          "Successfully subscribed to : ",
          JSON.stringify(response.channel)
        );
        this.subscription = response;
      })
      .catch((error) => {
        console.log("Error in subscription: ", error);
      });
  }

  // Unsubscribe from the platform event
  unsubscribeFromPlatformEvent() {
    // Unsubscribe from the platform event if a subscription exists
    if (this.subscription) {
      unsubscribe(this.subscription, (response) => {
        console.log("unsubscribe() response: ", JSON.stringify(response));
        // Response is true for successful unsubscribe
      });
    }
  }

  // Register an error listener for the platform event
  registerErrorListener() {
    onError((error) => {
      console.log("Received error from server: ", JSON.stringify(error));
      // Error contains the server-side error
    });
  }

  // Apex Call

  // Get the badge count from the server
  getBadgeCount() {
    let inputVariables = {
      userID: this.userId,
      sessionID: this.sessionStorageId
    };
    getCount({ flowName: this.flowName, inputVariables: inputVariables })
      .then((result) => {
        this.badgeCount = Math.trunc(result);
      })
      .catch((error) => {
        console.error(error.body.message);
      });
  }
}
