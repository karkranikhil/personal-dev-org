import { LightningElement, track, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getSessionData from "@salesforce/apex/CartButtonController.getSessionData";
import getCount from "@salesforce/apex/CartButtonController.getCount";
import { loadScript } from "lightning/platformResourceLoader";
import cometDLib from "@salesforce/resourceUrl/cometd";

function reduceErrors(errors) {
  if (!Array.isArray(errors)) {
    errors = [errors];
  }

  return (
    errors
      // Remove null/undefined items
      .filter((error) => !!error)
      // Extract an error message
      .map((error) => {
        // UI API read errors
        if (Array.isArray(error.body)) {
          return error.body.map((e) => e.message);
        }
        // UI API write errors
        else if (error.body && typeof error.body.message === "string") {
          return error.body.message;
        }
        // JS errors
        else if (typeof error.message === "string") {
          return error.message;
        }
        // Unknown error shape so try HTTP status text
        return error.statusText;
      })
      // Flatten
      .reduce((prev, curr) => prev.concat(curr), [])
      // Remove empty strings
      .filter((message) => !!message)
  );
}

export default class CartButton extends LightningElement {
  @api userId;
  @api sessionStorageId;
  @api flowName = "Get_Product_Count_Invokable"; // Default flow name
  @track badgeCount = 0;
  cometdInitialized = false;

  channelName = "/event/Add_Product_to_Basket__e";
  cookieName = "artBookingSession";
  cookieVal = "";

  connectedCallback() {
    this.checkCookies();
    this.getBadgeCount();
    this.initializeCometD();
  }

  initializeCometD() {
    if (!this.cometdInitialized) {
      Promise.all([loadScript(this, cometDLib)])
        .then(() => {
          this.initializeCometDConnection();
        })
        .catch((error) => {
          console.log(JSON.stringify(error));
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Error loading CometD",
              message: reduceErrors(error).join(", "),
              variant: "error"
            })
          );
        });
    }
  }

  initializeCometDConnection() {
    getSessionData()
      .then((result) => {
        console.log("@@SessionData: ", JSON.parse(JSON.stringify(result)));
        //let cometdUrl = result.instanceUrl + "/cometd/56.0/";
        let cometdUrl =
          window.location.protocol +
          "//" +
          window.location.hostname +
          "/cometd/56.0/";
        let cometdlib = new window.org.cometd.CometD();
        cometdlib.configure({
          url: cometdUrl,
          requestHeaders: { Authorization: "OAuth " + result.sessionId },
          appendMessageTypeToURL: false,
          logLevel: "debug"
        });
        cometdlib.websocketEnabled = false;
        cometdlib.handshake((status) => {
          console.log("@@ status: ", status);
          if (status.successful) {
            cometdlib.subscribe(this.channelName, (event) => {
              console.log(
                "@@ Received Message!",
                JSON.parse(JSON.stringify(event))
              );
              if (
                event.data.payload.UserID__c === this.userId ||
                event.data.payload.Booking_Session_ID__c ===
                  this.sessionStorageId
              ) {
                this.getBadgeCount();
              }
            });
          }
        });
        this.cometdInitialized = true;
      })
      .catch((error) => {
        console.error(
          "@@ An error occurred during CometD initialization",
          error
        );
      });
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
}
