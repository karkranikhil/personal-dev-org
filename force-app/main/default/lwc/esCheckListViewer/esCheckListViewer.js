/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 12-08-2021
 * @last modified by  : ErickSixto
 **/
import { LightningElement } from "lwc";
import { CloseActionScreenEvent } from "lightning/actions";

export default class EsCheckListViewer extends LightningElement {
  //?Stepper
  step = "1";
  isFirst = true;
  isSecond = false;

  //? Handles  Step Navigation
  handleNext() {
    this.isFirst = false;
    this.isSecond = true;
    this.step = "2";
  }
  handlePrevious() {
    this.isFirst = true;
    this.isSecond = false;
    this.step = "1";
  }
  closeAction() {
    this.dispatchEvent(new CloseActionScreenEvent());
  }
}
