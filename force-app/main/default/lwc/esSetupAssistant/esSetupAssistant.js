/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 12-07-2021
 * @last modified by  : ErickSixto
 **/
import { LightningElement, api } from "lwc";

export default class EsSetupAssistant extends LightningElement {
  @api completed = false;
  @api index = 1;
  @api title = "Item Title";
  @api description = "Description";
  @api additionalInfo = "Additional Info";
  @api badge = "Badge";
  @api badgeVariant = "default";
  @api firstLabel = "First Label";
  @api firstValue = "First Value";
  @api firstIconName = "utility:add";
  @api secondLabel = "Second Label";
  @api secondValue = "Second Value";
  @api secondIconName = "utility:help";
  @api thirdLabel = "Third Label";
  @api thirdValue = "Third Value";
  @api thirdIconName = "utility:clear";

  @api get output() {
    return this.selectedValue;
  }
  selectedValue;

  handleClick(event) {
    this.selectedValue = event.target.name;
    console.log(this.output);
  }
}
