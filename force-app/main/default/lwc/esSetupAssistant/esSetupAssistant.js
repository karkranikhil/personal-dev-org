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
  @api index;
  @api title;
  @api description;
  @api additionalInfo;
  @api badge;
  @api badgeVariant;
  @api firstLabel;
  @api firstValue;
  @api firstIconName;
  @api secondLabel;
  @api secondValue;
  @api secondIconName;
  @api thirdLabel;
  @api thirdValue;
  @api thirdIconName;
}
