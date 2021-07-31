import { LightningElement, api, track } from "lwc";
//*Styles
import { loadStyle } from "lightning/platformResourceLoader";
import styles from "@salesforce/resourceUrl/customToastStyles";
export default class CustomToast extends LightningElement {
  @track type;
  @track message;
  @track showToastBar = false;
  @api autoCloseTime = 5000;
  hasRendered = false;

  renderedCallback() {
    if (!this.hasRendered) {
      Promise.all([
        loadStyle(this, styles) //! Load The Custom Styles
      ]).then(() => console.log("Styles Loaded"));
    }
    this.hasRendered = true;
  }

  @api
  showToast(type, message) {
    this.type = type;
    this.message = message;
    this.showToastBar = true;
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this.closeModel();
    }, this.autoCloseTime);
  }

  closeModel() {
    this.showToastBar = false;
    this.type = "";
    this.message = "";
  }

  get getIconName() {
    return "utility:" + this.type;
  }
  get getSvgIconName() {
    return "/assets/icons/utility-sprite/svg/symbols.svg#" + this.type;
  }

  get innerClass() {
    return (
      "slds-icon_container slds-icon-utility-" +
      this.type +
      " slds-icon-utility-success slds-m-right_small slds-no-flex slds-align-top"
    );
  }

  get outerClass() {
    return "slds-notify slds-notify_toast slds-theme_" + this.type;
  }
}
