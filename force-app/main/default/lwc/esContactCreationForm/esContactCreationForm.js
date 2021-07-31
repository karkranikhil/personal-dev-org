import { LightningElement, api, wire, track } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import NAME_FIELD from "@salesforce/schema/Account.Name";
import MASS_TIMES from "@salesforce/schema/Account.Mass_Times__c";
import { NavigationMixin } from "lightning/navigation";

const FIELDS = [MASS_TIMES, NAME_FIELD];
export default class EsContactCreationForm extends NavigationMixin(
  LightningElement
) {
  @api recordId;
  @api redirectUrl;
  @track massTimeOptions;
  prefferedMassTime;

  //? Get the Account Information (Fields)
  @wire(getRecord, { recordId: "$recordId", fields: FIELDS })
  wiredRecord({ error, data }) {
    if (error) {
      let message = "Unknown error";
      if (Array.isArray(error.body)) {
        message = error.body.map((e) => e.message).join(",");
      } else if (typeof error.body.message === "string") {
        message = error.body.message;
      }
      this.dispatchEvent(
        new ShowToastEvent({
          title: "Error loading Account info",
          message,
          variant: "error"
        })
      );
    } else if (data) {
      if (data.fields.Mass_Times__c.value != null) {
        this.massTimeOptions = this.getOptions(data.fields.Mass_Times__c.value);
        this.template.querySelector("lightning-combobox").disabled = false;
      }
    }
  }

  //? Handles the combobox change event and assigns the selected mass time
  handleMassTimeChange(event) {
    this.prefferedMassTime = event.target.value;
  }

  //! override the form submit event
  handleSubmit(event) {
    event.preventDefault(); // stop the form from submitting
    const fields = {
      ...event.detail.fields,
      AccountId: this.recordId,
      Preffered_Mass_Time__c: this.prefferedMassTime
        ? this.prefferedMassTime
        : ""
    };
    this.template.querySelector("lightning-record-edit-form").submit(fields);
  }

  //! handles the success event on the form
  handleSuccess() {
    this.handleReset();
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Contact Created",
        message: "Thanks you for signing up!",
        variant: "success"
      })
    ); //*UNCOMMENT IF YOU WANT TO TRY WITH NATIVE TOAST
    this.navigateToWebPage();
  }
  //! handles the error event on the form
  handleError(error) {
    console.error(error);
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Error",
        message: "Something went wrong",
        variant: "error"
      })
    );
  }
  //?Formats the options to an array of objects so it matches the combobox format
  getOptions(text) {
    let textList = text.split(", ");
    return textList.map((option) => ({
      ...option,
      label: option,
      value: option
    }));
  }
  //! Navigate to a URL
  navigateToWebPage() {
    console.log("Navigating to external URL");
    this[NavigationMixin.Navigate](
      {
        type: "standard__webPage",
        attributes: {
          url: this.redirectUrl
        }
      },
      true // Replaces the current page in your browser history with the URL
      // );//! Didnt work on digital experience
    );
  }

  handleReset() {
    const inputFields = this.template.querySelectorAll("lightning-input-field");
    if (inputFields) {
      inputFields.forEach((field) => {
        field.reset();
      });
    }
    this.template.querySelector("lightning-combobox").value = null;
  }
}
