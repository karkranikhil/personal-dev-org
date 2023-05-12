import { LightningElement, track, api } from "lwc";
import getCount from "@salesforce/apex/CartButtonController.getCount";

export default class CartButton extends LightningElement {
  @api userId;
  @api sessionStorageId;
  @api flowName = "Get_Product_Count_Invokable"; // Default flow name
  @track badgeCount = 0;

  connectedCallback() {
    this.getBadgeCount();
  }

  get isDisplayBadge() {
    return this.badgeCount != null && this.badgeCount > 0;
  }
  getBadgeCount() {
    let inputVariables = [
      { name: "userId", type: "String", value: this.userId },
      { name: "sessionStorageId", type: "String", value: this.sessionStorageId }
    ];
    getCount({ flowName: this.flowName, inputVariables: inputVariables })
      .then((result) => {
        this.badgeCount = result;
      })
      .catch((error) => {
        console.error(error.body.message);
      });
  }
}
