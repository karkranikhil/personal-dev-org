/**
 * @description       :
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 01-21-2022
 * @last modified by  : ErickSixto
 **/
import { LightningElement, api, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

/** Apex methods from EsLookupController */
import search from "@salesforce/apex/esLookupController.search";
import getRecentlyViewed from "@salesforce/apex/esLookupController.getRecentlyViewed";

export default class EsLookup extends LightningElement {
  //* ---------------------------- VARIABLES ------------------------------------------------//
  recordId = null;
  sobject = "";
  uniqueField = "";
  uniqueFieldValue = "";
  icon = "standard:default";
  errors = [];
  recentlyViewed = [];
  initialSelection = [
    {
      id: this.recordId,
      sObjectType: this.sobject,
      icon: this.icon,
      title: "Passed Record",
      subtitle: this.sobject
    }
  ];

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
    console.log("Received Data", JSON.parse(JSON.stringify(data)));
    this.recordId = data.recordId;
    this.sobject = data.sobject;
    this.uniqueField = data.uniqueField;
    this.uniqueFieldValue = data.uniqueFieldValue;
    this.icon =
      "standard:" + data.sobject.includes("__c")
        ? "default"
        : data.sobject.toLowerCase();
  }

  //* ---------------------------- LIFE CYCLE ----------------------------------------------//
  connectedCallback() {
    this.initLookupDefaultResults();
  }

  //* ---------------------------- BACKEND CALLS ------------------------------------------//

  @wire(getRecentlyViewed)
  getRecentlyViewed({ data }) {
    if (data) {
      this.recentlyViewed = data;
      this.initLookupDefaultResults();
    }
  }

  //* ---------------------------- LOOKUP METHODS ------------------------------------------//

  // Loads recently viewed records and set them as default lookpup search results (optional)

  //Initializes the lookup default results with a list of recently viewed records (optional)
  initLookupDefaultResults() {
    // Make sure that the lookup is present and if so, set its default results
    const lookup = this.template.querySelector("c-lookup");
    if (lookup) {
      lookup.setDefaultResults(this.recentlyViewed);
    }
  }

  /**
   * Handles the lookup search event.
   * Calls the server to perform the search and returns the resuls to the lookup.
   * @param {event} event `search` event emmitted by the lookup
   */
  handleLookupSearch(event) {
    const lookupElement = event.target;
    // Call Apex endpoint to search for records and pass results to the lookup
    search(event.detail)
      .then((results) => {
        lookupElement.setSearchResults(results);
      })
      .catch((error) => {
        this.notifyUser(
          "Lookup Error",
          "An error occured while searching with the lookup field.",
          "error"
        );
        // eslint-disable-next-line no-console
        console.error("Lookup error", JSON.stringify(error));
        this.errors = [error];
      });
  }

  /**
   * Handles the lookup selection change
   * @param {event} event `selectionchange` event emmitted by the lookup.
   * The event contains the list of selected ids.
   */
  // eslint-disable-next-line no-unused-vars
  handleLookupSelectionChange(event) {
    this.checkForErrors();
  }

  // All functions below are part of the sample app form (not required by the lookup).

  handleSubmit() {
    this.checkForErrors();
    if (this.errors.length === 0) {
      this.notifyUser("Success", "The form was submitted.", "success");
    }
  }

  handleClear() {
    this.initialSelection = [];
    this.errors = [];
  }

  //* ---------------------------- UTILITY METHODS ------------------------------------------//

  checkForErrors() {
    this.errors = [];
    const selection = this.template.querySelector("c-lookup").getSelection();
    //TODO Error Handling
    this.errors.push({
      message: `Error Test`
    });
  }

  notifyUser(title, message, variant) {
    const toastEvent = new ShowToastEvent({ title, message, variant });
    this.dispatchEvent(toastEvent);
  }
}
