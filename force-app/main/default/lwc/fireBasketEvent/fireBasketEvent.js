import { LightningElement, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import fireEvent from "@salesforce/apex/CartButtonController.fireEvent";

export default class FireBasketEvent extends LightningElement {
  @api userId = "0057e00000V0g7JAAR"; // User Id input
  @api sessionId = ""; // Session Id input

  handleUserIdChange(event) {
    this.userId = event.target.value;
  }

  handleSessionIdChange(event) {
    this.sessionId = event.target.value;
  }

  handleClick() {
    fireEvent({ userId: this.userId, sessionId: this.sessionId })
      .then(() => {
        const evt = new ShowToastEvent({
          title: "Event Fired",
          message:
            "Add_Product_to_Basket__e event fired with User ID: " +
            this.userId +
            " and Session ID: " +
            this.sessionId,
          variant: "success"
        });
        this.dispatchEvent(evt);
      })
      .catch((error) => {
        console.error("Error in firing event: ", error);
      });
  }
}
