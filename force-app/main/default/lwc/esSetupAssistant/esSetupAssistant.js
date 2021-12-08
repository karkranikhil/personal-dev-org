/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 12-08-2021
 * @last modified by  : ErickSixto
 **/
import { LightningElement, api } from "lwc";

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

  @api get output() {
    return this.selectedValue;
  }
  selectedValue;

  handleClick(event) {
    this.selectedValue = event.target.name;
    window.alert(this.selectedValue);
  }
}
