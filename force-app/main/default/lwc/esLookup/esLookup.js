/**
 * @description       : Custom Lookup - Wont work for certain objects like 'Task, Event, ...'
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 01-22-2022
 * @last modified by  : ErickSixto
 **/
import { LightningElement, api, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { refreshApex } from "@salesforce/apex";

/** Apex methods from EsLookupController */
import search from "@salesforce/apex/esLookupController.search";
import getRecentlyViewed from "@salesforce/apex/esLookupController.getRecentlyViewed";
import getObjectOptions from "@salesforce/apex/esLookupController.getObjectOptions";

const DEFAULT_ICON = "standard:default";
export default class EsLookup extends LightningElement {
  //* ---------------------------- VARIABLES ------------------------------------------------//
  recordId = null;
  sobject = "";
  uniqueField = "";
  uniqueFieldValue = "";
  icon = DEFAULT_ICON;
  objectInformation;
  errors = [];
  recentlyViewed = [];
  initialSelection = null;
  // initialSelection = [
  //   {
  //     id: this.recordId,
  //     sObjectType: this.sobject,
  //     icon: this.icon,
  //     title: "Passed Record",
  //     subtitle: this.sobject
  //   }
  // ];

  //* ---------------------------- GETTERS AND SETTERS ---------------------------------------//
  @api
  get lookupData() {
    return {
      recordId: this.recordId,
      sobject: this.sobject,
      uniqueField: this.uniqueField,
      uniqueFieldValue: this.uniqueFieldValue
    };
  }
  set lookupData(data) {
    this.recordId = data.recordId;
    this.sobject = data.sobject;
    this.uniqueField = data.uniqueField;
    this.uniqueFieldValue = data.uniqueFieldValue;
  }

  //* ---------------------------- LIFE CYCLE ----------------------------------------------//
  connectedCallback() {
    this.initLookupDefaultResults();
  }

  //* ---------------------------- BACKEND CALLS ------------------------------------------//

  @wire(getRecentlyViewed, { objectApiName: "$sobject" })
  getRecentlyViewed({ data }) {
    if (data) {
      this.recentlyViewed = data.map((record) => ({
        ...record,
        icon: this.icon
      }));
      console.log(
        "Recently Viewed Wire",
        JSON.parse(JSON.stringify(this.recentlyViewed))
      );
      this.initLookupDefaultResults();
    }
  }

  @wire(getObjectInfo, { objectApiName: "$sobject" })
  handleResult({ error, data }) {
    if (data) {
      this.objectInformation = data;
      this.themeInfo = data.themeInfo || null;
      let iconUrl = this.themeInfo.iconUrl || null;
      console.log(
        "Object Info",
        JSON.parse(JSON.stringify(this.objectInformation))
      );
      console.log("Theme Info", JSON.parse(JSON.stringify(this.themeInfo)));
      this.setIconName(iconUrl);
      this.initLookupDefaultResults();
    }
    if (error) {
      console.log(error);
      if (error.body.errorCode === "INVALID_TYPE") {
        this.icon = DEFAULT_ICON;
      }
    }
  }

  //* ---------------------------- LOOKUP METHODS ------------------------------------------//

  //Initializes the lookup default results with a list of recently viewed records (optional)
  initLookupDefaultResults() {
    // Make sure that the lookup is present and if so, set its default results
    const lookup = this.template.querySelector("c-lookup.record-lookup");
    if (lookup) {
      let records = this.recentlyViewed.map((record) => ({
        ...record,
        icon: this.icon
      }));
      lookup.setSearchResults(records);
      //lookup.setDefaultResults(records);
    }
  }

  /**
   * Handles the lookup search event.
   * Calls the server to perform the search and returns the resuls to the lookup.
   * @param {event} event `search` event emmitted by the lookup
   */
  handleLookupSearch(event) {
    const lookupElement = event.target;
    console.log(JSON.parse(JSON.stringify(event.detail)));
    // Call Apex endpoint to search for records and pass results to the lookup
    search({ ...event.detail, objectApiName: this.sobject })
      .then((results) => {
        let records = results.map((record) => ({ ...record, icon: this.icon }));
        lookupElement.setSearchResults(records);
      })
      .catch((error) => {
        this.notifyUser("Lookup Error", error.body.message, "error");
        // eslint-disable-next-line no-console
        console.error("Lookup error", JSON.stringify(error));
        this.errors.push({
          message: error.body.message
        });
      });
  }
  /**
   * Handles the lookup search event.
   * Calls the server to perform the search and returns the resuls to the lookup.
   * @param {event} event `search` event emmitted by the lookup
   */
  handleObjectSearch(event) {
    const lookupElement = event.target;
    console.log(JSON.parse(JSON.stringify(event.detail)));
    // Call Apex endpoint to search for records and pass results to the lookup
    getObjectOptions({ searchTerm: event.detail.searchTerm })
      .then((results) => {
        let options = results.map((option) => ({ ...option }));
        lookupElement.setSearchResults(options);
      })
      .catch((error) => {
        this.notifyUser("Lookup Error", error.body.message, "error");
        // eslint-disable-next-line no-console
        console.error("Lookup error", JSON.stringify(error));
        this.errors.push({
          message: error.body.message
        });
      });
  }

  /**
   * Handles the lookup selection change
   * @param {event} event `selectionchange` event emmitted by the lookup.
   * The event contains the list of selected ids.
   */
  // eslint-disable-next-line no-unused-vars
  handleObjectSelectionChange(event) {
    const selection = event.target.getSelection();
    this.sobject = selection[0].sObjectType;
  }
  handleLookupSelectionChange(event) {
    const selection = event.target.getSelection()[0];
    this.checkForErrors();
    console.log(JSON.parse(JSON.stringify(selection)));
    const selectEvent = new CustomEvent("selected", {
      detail: {
        recordId: selection.id,
        sobject: selection.sObjectType,
        uniqueField: "Test",
        uniqueFieldValue: ""
      }
    });
    this.dispatchEvent(selectEvent);
  }

  handleClear() {
    this.recordId = null;
    this.sobject = null;
    this.uniqueField = null;
    this.uniqueFieldValue = null;
    this.initialSelection = [];
    this.errors = [];
  }

  //* ---------------------------- UTILITY METHODS ------------------------------------------//

  //*Sets errors based on selection (not used but you can add your scenarios)
  checkForErrors() {
    this.errors = [];
    const selection = this.template
      .querySelector("c-lookup.record-lookup")
      .getSelection();
    //TODO Error Handling: Here you can type your custom error scenarios - ErickSixto
    // this.errors.push({
    //   message: `Error Message`
    // });
  }

  //*Shows a toast with passed parameters
  notifyUser(title, message, variant) {
    const toastEvent = new ShowToastEvent({ title, message, variant });
    this.dispatchEvent(toastEvent);
  }

  //* Sets the SLDS iconname from the iconURL
  setIconName(iconUrl) {
    if (iconUrl) {
      let array = iconUrl.split("/");
      let iconName =
        array[array.length - 2] +
        ":" +
        array[array.length - 1].substring(
          0,
          array[array.length - 1].lastIndexOf("_")
        );
      this.icon = iconName;
    } else {
      this.icon = DEFAULT_ICON;
    }
  }
}
