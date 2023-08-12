import { LightningElement, wire } from "lwc";
import {
  subscribe,
  APPLICATION_SCOPE,
  MessageContext
} from "lightning/messageService";
import BASKET_UPDATE_CHANNEL from "@salesforce/messageChannel/BasketUpdateChannel__c";

export default class ViewCartWrapper extends LightningElement {
  subscription = null;
  showFlow = true; // Variable to control rendering

  @wire(MessageContext)
  messageContext;

  connectedCallback() {
    console.log("connectedCallback invoked");
    this.subscribeToMessageChannel();
  }

  subscribeToMessageChannel() {
    console.log("Subscribing to message channel");
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        BASKET_UPDATE_CHANNEL,
        (message) => this.handleMessage(message),
        { scope: APPLICATION_SCOPE }
      );
      console.log("Subscription successful");
    }
  }

  async handleMessage(message) {
    console.log("Message received:", message);
    if (message && message.messageToSend === "Update Basket") {
      console.log("Refreshing flow");
      this.showFlow = false; // Remove the flow from DOM

      // After a brief delay, re-render the flow
      setTimeout(() => {
        this.showFlow = true;
      }, 250);
    }
  }

  disconnectedCallback() {
    console.log("disconnectedCallback invoked");
    unsubscribe(this.subscription);
    this.subscription = null;
  }

  handleFlowStatusChange(event) {
    // You can handle flow status changes here if needed
    console.log("Flow status changed:", event);
  }
}
