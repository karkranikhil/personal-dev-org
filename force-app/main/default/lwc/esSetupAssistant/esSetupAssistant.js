/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 12-08-2021
 * @last modified by  : ErickSixto
 **/
import { LightningElement, api } from "lwc";
import {
  FlowNavigationFinishEvent,
  FlowNavigationNextEvent
} from "lightning/flowSupport";
export default class EsSetupAssistant extends LightningElement {
  @api completed = false;
  @api index = 1;
  @api title = "Item Title";
  @api description = "Description";
  @api additionalInfo = "Additional Info";
  @api badge;
  @api badgeVariant = "default";
  @api firstLabel;
  @api firstValue;
  @api firstIconName;
  @api secondLabel;
  @api secondValue;
  @api secondIconName;
  @api thirdLabel;
  @api thirdValue;
  @api thirdIconName;

  @api
  availableActions = [];

  @api get output() {
    return this.selectedValue;
  }
  selectedValue;

  handleClick(event) {
    this.selectedValue = event.target.name;
    this.handleGoNext();
  }

  handleGoNext() {
    // check if NEXT is allowed on this screen
    if (this.availableActions.find((action) => action === "NEXT")) {
      // navigate to the next screen
      const navigateNextEvent = new FlowNavigationNextEvent();
      this.dispatchEvent(navigateNextEvent);
    }
    // check if NEXT is allowed on this screen
    if (this.availableActions.find((action) => action === "FINISH")) {
      // navigate to the next screen
      const navigateFinishEvent = new FlowNavigationFinishEvent();
      this.dispatchEvent(navigateFinishEvent);
    }
  }

  @api
  validate() {
    return true;
  }
}
