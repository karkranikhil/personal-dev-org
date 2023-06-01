import { LightningElement, wire, api } from "lwc";
import {
  publish,
  subscribe,
  unsubscribe,
  createMessageContext,
  releaseMessageContext
} from "lightning/messageService";
import BASKET_UPDATE_CHANNEL from "@salesforce/messageChannel/BasketUpdateChannel__c";

export default class BrowseProductsWrapper extends LightningElement {
  @api basketId = "";
  @api bookingDate = null;
  @api destinationId = "";
  @api experienceId = "";
  @api repBasketId = "";
  @api flowApiName = "Browse_Products"; // Default flow API name

  messageContext = createMessageContext();

  disconnectedCallback() {
    releaseMessageContext(this.context);
  }

  get inputVariables() {
    const inputVariables = [
      { name: "BasketID", type: "String", value: this.basketId },
      { name: "BookingDate", type: "Date", value: this.bookingDate },
      { name: "DestinationID", type: "String", value: this.destinationId },
      { name: "ExperienceID", type: "String", value: this.experienceId },
      { name: "RepBasketID", type: "String", value: this.repBasketId }
    ];
    console.log("@@Input Variables", inputVariables);
    return inputVariables;
  }

  // Handle flow status change
  handleStatusChange(event) {
    console.log("@@ Flowevent: ", JSON.parse(JSON.stringify(event.detail)));
    if (
      event.detail.status === "STARTED" ||
      event.detail.status === "FINISHED"
    ) {
      const outputVariables = event.detail.outputVariables;
      const selectedProductBasketsVar = outputVariables.find(
        (variable) => variable.name === "SelectedProductBaskets"
      );

      // Check if selectedProductBasketsVar is not null and has items
      if (
        selectedProductBasketsVar &&
        selectedProductBasketsVar.value &&
        selectedProductBasketsVar.value.length > 0
      ) {
        this.fireMessage();
      }
    }
  }

  fireMessage() {
    const message = {
      messageToSend: "Demo Message",
      sourceSystem: this.flowApiName
    };
    console.log("@@ Firingmessage: ", message);
    publish(this.messageContext, BASKET_UPDATE_CHANNEL, message);
  }
  unsubscribeMC() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }
}
