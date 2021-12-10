/* eslint-disable @lwc/lwc/no-async-operation */
/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 12-09-2021
 * @last modified by  : ErickSixto
 **/
import { LightningElement, api } from "lwc";
import { CloseActionScreenEvent } from "lightning/actions";

export default class EsCheckListViewer extends LightningElement {
  //? Stepper
  step = "1";
  isFirst = true;
  isSecond = false;

  @api recordId;

  //? Lifecicle Methods
  @api invoke() {
    console.log("RecordId", this.recordId);
  }

  //* Step Navigation Handlers
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

  //* Utility
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
