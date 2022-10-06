/**
 * @description       : Custom Lookup - Wont work for certain objects like 'Task, Event, ...'
 *                      which are not supported by the User Interface API (https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_all_supported_objects.htm)
 * @author            : ErickSixto
 * @group             :
 * @last modified on  : 10-05-2022
 * @last modified by  : ErickSixto
 **/
import { LightningElement, api, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { getRecord } from "lightning/uiRecordApi";

/** Apex methods from EsLookupController */
import search from "@salesforce/apex/esLookupController.search";
import getRecentlyViewed from "@salesforce/apex/esLookupController.getRecentlyViewed";
import getObjectOptions from "@salesforce/apex/esLookupController.getObjectOptions";
import searchWithUniqueField from "@salesforce/apex/esLookupController.searchWithUniqueField";

const DEFAULT_ICON = "standard:default";
export default class EsLookup extends LightningElement {
  //* ---------------------------- VARIABLES ------------------------------------------------//
  //? Input/Output parameters
  recordId = null;
  secondaryRecordId = null;
  sobject = "";
  uniqueField;
  uniqueFieldValue;
  objectNameFieldMapping = null;

  //? Record Specific
  recordUniqueFields;

  //?Object Specific
  icon = DEFAULT_ICON;
  objectInformation;
  objectLabel = "";
  uniqueFields = [];
  uniqueFieldsWire;
  validSobject = false;

  //? Utility
  errors = [];
  recentlyViewed = [];
  initialSelection = [];
  isShowModal = false;

  //* ---------------------------- GETTERS AND SETTERS ---------------------------------------//
  @api
  get lookupData() {
    return {
      recordId: this.recordId,
      sobject: this.sobject,
      uniqueField: this.uniqueField,
      uniqueFieldValue: this.uniqueFieldValue,
      objectNameFieldMapping: this.objectNameFieldMapping
    };
  }
  set lookupData(data) {
    console.log("Setting Data: ", JSON.parse(JSON.stringify(data)));
    this.recordId = data?.recordId;
    this.sobject = data?.sobject;
    this.uniqueField = data?.uniqueField;
    this.uniqueFieldValue = data?.uniqueFieldValue;
    this.objectNameFieldMapping = data?.objectNameFieldMapping;
  }

  //* ---------------------------- LIFE CYCLE ----------------------------------------------//
  connectedCallback() {
    if (
      (this.recordId.length > 0 && this.recordId.length < 18) ||
      this.recordId.length > 18
    ) {
      this.notifyUser(
        "Invalid ID",
        "Record Id must be 18 characters long",
        "error"
      );
    }
    if (
      this.recordId.length === 0 &&
      this.sobject &&
      this.uniqueField &&
      this.uniqueFieldValue
    ) {
      this.secondarySearch();
    }
    this.initLookupDefaultResults();
  }

  //* ---------------------------- BACKEND CALLS ------------------------------------------//

  //* GET RECENTLY VIEWED
  @wire(getRecentlyViewed, {
    objectApiName: "$sobject"
  })
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

  //* GET OBJECT DATA
  @wire(getObjectInfo, { objectApiName: "$sobject" })
  handleResult({ error, data }) {
    if (data) {
      this.validSobject = true;
      this.objectInformation = data;
      this.themeInfo = data.themeInfo || null;
      let iconUrl = this.themeInfo.iconUrl || null;
      this.objectLabel = this.objectInformation.label
        ? this.objectInformation.label
        : "Record";
      this.setUniqueFields(this.objectInformation.fields);
      this.setIconName(iconUrl);
      this.initLookupDefaultResults();

      console.log(
        "Object Info",
        JSON.parse(JSON.stringify(this.objectInformation))
      );

      console.log(
        "Unique Fields",
        JSON.parse(JSON.stringify(this.uniqueFields))
      );
    }
    if (error) {
      if (error.body.errorCode === "INVALID_TYPE") {
        const lookupElement = this.template.querySelector(
          ".custom-lookup.object-lookup"
        );
        lookupElement.handleClearSelection();
        this.notifyUser(
          "Not supported Object",
          "This Object is not supported by the User Interface API",
          "error"
        );
      }
      if (error.body.errorCode === "INSUFFICIENT_ACCESS") {
        this.notifyUser(
          "SObject Error",
          "Not a valid SObject or Insufficient Access",
          "error"
        );
      }
    }
  }

  //* GET RECORD DATA
  @wire(getRecord, { recordId: "$recordId", fields: "$uniqueFieldsWire" })
  wiredRecord({ error, data }) {
    if (error) {
      let message = "Unknown error";
      let errorCode;
      if (Array.isArray(error.body)) {
        message = error.body.map((e) => e.message).join(", ");
      } else if (typeof error.body.message === "string") {
        message = error.body.message;
        errorCode = error.status;
      }
      if (errorCode === 404 || errorCode === 400) {
        this.secondarySearch();
      } else {
        this.notifyUser("Error loading Record", message, "error");
      }
    } else if (data) {
      this.recordUniqueFields = data.fields;
      this.setUniqueFieldValue();

      let nameField = this.uniqueFields.find(
        (field) => field.nameField
      ).apiName;
      let fallbackSearchField = this.getCustomSearchField();
      if (this.initialSelection.length === 0) {
        let recordTitle = data.fields[nameField].value;
        if (fallbackSearchField) {
          recordTitle = data.fields[fallbackSearchField].value;
        }
        this.initialSelection = [
          {
            id: this.recordId,
            sObjectType: this.sobject,
            icon: this.icon,
            title: recordTitle,
            subtitle: this.sobject
          }
        ];
      }
      const selectEvent = new CustomEvent("selected", {
        detail: {
          recordId: data.id,
          sobject: this.sobject,
          uniqueField: this.uniqueField,
          uniqueFieldValue: this.uniqueFieldValue
        }
      });
      this.dispatchEvent(selectEvent);
    }
  }

  //* ---------------------------- LOOKUP METHODS ------------------------------------------//

  //?Initializes the lookup default results with a list of recently viewed records (optional)
  initLookupDefaultResults() {
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
   * ?Handles the lookup search event.
   * Calls the server to perform the search and returns the resuls to the lookup.
   * @param {event} event `search` event emmitted by the lookup
   */
  handleLookupSearch(event) {
    const lookupElement = event.target;
    const customSearchField = this.getCustomSearchField();
    console.log("Searching...");
    // Call Apex endpoint to search for records and pass results to the lookup
    search({
      ...event.detail,
      objectApiName: this.sobject,
      customNameField: customSearchField
    })
      .then((results) => {
        let records = results.map((record) => ({ ...record, icon: this.icon }));
        lookupElement.setSearchResults(records);
      })
      .catch((error) => {
        this.notifyUser("Lookup Error", error.body.message, "error");
        // eslint-disable-next-line no-console

        this.errors.push({
          message: error.body.message
        });
      });
  }
  /**
   * ?Handles the lookup search event.
   * Calls the server to perform the search and returns the resuls to the lookup.
   * @param {event} event `search` event emmitted by the lookup
   */
  handleObjectSearch(event) {
    const lookupElement = event.target;

    // Call Apex endpoint to search for records and pass results to the lookup
    getObjectOptions({ searchTerm: event.detail.searchTerm })
      .then((results) => {
        let options = results.map((option) => ({ ...option }));
        lookupElement.setSearchResults(options);
      })
      .catch((error) => {
        this.notifyUser("Lookup Error", error.body.message, "error");
        // eslint-disable-next-line no-console

        this.errors.push({
          message: error.body.message
        });
      });
  }

  /**
   * ?Handles the lookup selection change
   * @param {event} event `selectionchange` event emmitted by the lookup.
   * The event contains the list of selected ids.
   */
  // eslint-disable-next-line no-unused-vars
  handleObjectSelectionChange(event) {
    const selection = event.target.getSelection();
    this.sobject = selection[0].sObjectType;
    this.objectLabel = selection[0].title;
  }
  handleLookupSelectionChange(event) {
    const selection = event.target.getSelection()[0];
    this.checkForErrors();

    this.recordId = selection.id;
  }
  handleRecordClear(event) {
    console.log("Clearing record...");
    this.recordId = null;
    this.initialSelection = [];
    this.errors = [];
  }

  handleClear() {
    this.recordId = null;
    this.sobject = null;
    this.uniqueField = null;
    this.uniqueFieldValue = null;
    this.initialSelection = [];
    this.errors = [];
    this.validSobject = false;
  }

  //* ---------------------------- UTILITY METHODS ------------------------------------------//

  //*Sets errors based on selection (not used but you can add your scenarios)
  checkForErrors() {
    this.errors = [];
    //TODO Error Handling: Here you can type your custom error scenarios - ErickSixto
    // const selection = this.template
    //   .querySelector("c-lookup.record-lookup")
    //   .getSelection();
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

  //* Sets the Unique Fields combobox options
  setUniqueFields(uniqueFields) {
    let uniqueFieldsCopy = { ...uniqueFields };
    const customSearchField = this.getCustomSearchField();
    if (customSearchField) {
      console.log("Unique Fields: ", uniqueFields);
      let fallbackSearchField = {
        ...uniqueFields[customSearchField],
        isCustomSearchField: true
      };
      uniqueFieldsCopy[customSearchField] = fallbackSearchField;
      console.log("Copy: ", uniqueFieldsCopy);
    }
    let filteredFields = Object.fromEntries(
      Object.entries(uniqueFieldsCopy).filter(
        ([key, value]) =>
          value?.unique ||
          value.apiName === "Id" ||
          value?.nameField ||
          value?.isCustomSearchField
      )
    );

    let fields = Object.keys(filteredFields).map((key) => {
      return filteredFields[key];
    });

    this.uniqueFields = fields.map((field) => ({
      ...field,
      value: field.apiName
    }));
    let lastUniqueField = this.uniqueFields.find(
      (field) => field.apiName === this.uniqueField
    )?.value;

    const selectedField = lastUniqueField ? lastUniqueField : "Id";
    this.sendFieldToBeginning(selectedField);
    this.uniqueField = selectedField;

    this.uniqueFieldsWire = this.uniqueFields.map(
      (field) => this.sobject + "." + field.apiName
    );
    //! To remove the custom search field from the Unique Fields list
    this.uniqueFields = this.uniqueFields.filter(
      (field) => field?.unique || field.apiName === "Id" || field?.nameField
    );
    this.uniqueFields = [...this.uniqueFields];
  }

  //* Sort unique fields to send matching element to beginning of array
  sendFieldToBeginning(fieldApiName) {
    const foundIdx = this.uniqueFields.findIndex(
      (el) => el.apiName === fieldApiName
    );
    const foundElement = this.uniqueFields.find(
      (el) => el.apiName === fieldApiName
    );
    this.uniqueFields.splice(foundIdx, 1);
    this.uniqueFields.unshift(foundElement);
    this.uniqueFields = [...this.uniqueFields];
  }

  //* Sets the UniqueFieldApiname
  handleSelectedUniqueField(event) {
    this.uniqueField = event.target.value;
    this.setUniqueFieldValue();
  }

  //* Sets the UniqueFieldValue
  setUniqueFieldValue() {
    this.uniqueFieldValue = this.recordUniqueFields[this.uniqueField]?.value;
  }

  //* Looks if the object has a Custom Search Field. Returns null if not
  getCustomSearchField() {
    const objectName = this.sobject;
    const customMapping = this.objectNameFieldMapping.find(
      (mapping) => mapping.sobject === objectName
    );
    const customSearchField = customMapping?.fallbackSearchField;
    return customSearchField;
  }

  //* Launch Secondary Search
  secondarySearch() {
    if (this.uniqueField && this.uniqueFieldValue && this.sobject) {
      searchWithUniqueField({
        uniqueField: this.uniqueField,
        uniqueFieldValue: this.uniqueFieldValue,
        objectApiName: this.sobject
      })
        .then((response) => {
          console.log(
            "Search With Unique",
            JSON.parse(JSON.stringify(response))
          );
          if (response) {
            this.isShowModal = true;
            this.secondaryRecordId = response.id;
          } else {
            this.notifyUser(
              "Error loading Record",
              "No record with that Id or Unique field value was found",
              "error"
            );
          }
        })
        .catch((error) => {
          let message = "Unknown error";
          if (Array.isArray(error.body)) {
            message = error.body.map((e) => e.message).join(", ");
          } else if (typeof error.body.message === "string") {
            message = error.body.message;
          }
          this.notifyUser("Error loading Record", message, "error");
        });
    }
  }
  cancelSecondarySearch() {
    this.isShowModal = false;
  }
  confirmSecondarySearch() {
    if (this.initialSelection.length === 0) {
      this.recordId = this.secondaryRecordId;
    }
    this.isShowModal = false;
  }
}
