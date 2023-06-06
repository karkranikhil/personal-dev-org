import { LightningElement} from "lwc";
import {
  publish,
  createMessageContext,
  releaseMessageContext
} from "lightning/messageService";
import BASKET_UPDATE_CHANNEL from "@salesforce/messageChannel/BasketUpdateChannel__c";

export default class FireBasketUpdateMessage extends LightningElement {

  
    messageContext = createMessageContext();
    connectedCallback() {
        this.fireMessage()
    }
  
    disconnectedCallback() {
      releaseMessageContext(this.context);
    }

    fireMessage() {
        const message = {
          messageToSend: "Update Basket"
        };
        console.log("@@ Firingmessage: ", message);
        publish(this.messageContext, BASKET_UPDATE_CHANNEL, message);
      }
}