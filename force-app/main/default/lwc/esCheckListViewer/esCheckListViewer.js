/* eslint-disable @lwc/lwc/no-async-operation */
/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 12-23-2021
 * @last modified by  : ErickSixto
 **/
import { LightningElement, api } from "lwc";
import { CloseActionScreenEvent } from "lightning/actions";

export default class EsCheckListViewer extends LightningElement {
  //? Use the Value to identify the selected option
  options = [
    { label: "Close Win Checklist", value: "closewin" },
    { label: "Document X Checklist", value: "docX" },
    { label: "Document Y Checklist", value: "docY" }
  ];

  //! Select option1 by default
  selected = "closewin";

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
  handleSelected(e) {
    this.selected = e.detail.selectedOption;
  }
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
