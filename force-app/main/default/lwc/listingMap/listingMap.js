import { LightningElement, api, wire, track } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import CITY_FIELD from "@salesforce/schema/Listing__c.City__c";
import STATE_FIELD from "@salesforce/schema/Listing__c.State__c";
import ZIP_FIELD from "@salesforce/schema/Listing__c.Zip_Code__c";
import ADDRESS_FIELD from "@salesforce/schema/Listing__c.Address__c";
import LATITUDE_FIELD from "@salesforce/schema/Listing__c.Latitude__c";
import LONGITUDE_FIELD from "@salesforce/schema/Listing__c.Longitude__c";
import TITLE_FIELD from "@salesforce/schema/Listing__c.Listing_Title__c";
import OTA_FIELD from "@salesforce/schema/Listing__c.OTA__c";
import NAME_FIELD from "@salesforce/schema/Listing__c.Name";

const FIELDS = [
  CITY_FIELD,
  LATITUDE_FIELD,
  LONGITUDE_FIELD,
  TITLE_FIELD,
  OTA_FIELD,
  NAME_FIELD,
  STATE_FIELD,
  ZIP_FIELD,
  ADDRESS_FIELD
];

const LIST_VIEW_VISIBLE = "visible";
const LIST_VIEW_HIDDEN = "hidden";
const DEFAULT_ZOOM = 15;

export default class ListingMap extends LightningElement {
  @api recordId;
  selectedMarkerValue;
  zoomLevel = DEFAULT_ZOOM;
  listViewValue = LIST_VIEW_VISIBLE;

  mapOptions = {
    disableDefaultUI: true
  };
  center;

  @track listing;
  @track properties;
  @track mapMarkers;

  get isListHidden() {
    return this.listViewValue === LIST_VIEW_HIDDEN;
  }

  @wire(getRecord, { recordId: "$recordId", fields: FIELDS })
  wiredRecord({ error, data }) {
    if (error) {
      let message = "Unknown error";
      if (Array.isArray(error.body)) {
        message = error.body.map((e) => e.message).join(", ");
      } else if (typeof error.body.message === "string") {
        message = error.body.message;
      }
      console.log("Error", message);
    } else if (data) {
      let listing = data;

      this.listing = {
        Name: listing.fields.Name.value,
        City: listing.fields.City__c.value,
        State: listing.fields.State__c.value,
        Zip: listing.fields.Zip_Code__c.value,
        Street: listing.fields.Address__c.value,
        Latitude: listing.fields.Latitude__c.value,
        Longitude: listing.fields.Longitude__c.value,
        Title: listing.fields.Listing_Title__c.value,
        OTA: listing.fields.OTA__c.value
      };
      this.mapMarkers = [
        {
          location: {
            City: this.listing.City,
            PostalCode: this.listing.Zip,
            State: this.listing.State,
            Street: this.listing.Street,
            Latitude: this.listing.Latitude,
            Longitude: this.listing.Longitude
          },
          value: this.recordId,
          title: `Listing: ${this.listing.Title}`,
          description: `Watchtower ID: ${this.listing.Name} - ${this.listing.OTA}`
        }
      ];
      this.center = {
        location: {
          City: this.listing.City,
          PostalCode: this.listing.Zip,
          State: this.listing.State,
          Street: this.listing.Street,
          Latitude: this.listing.Latitude,
          Longitude: this.listing.Longitude
        }
      };

      console.log("LISTING", JSON.parse(JSON.stringify(this.listing)));
    }
  }

  connectedCallback() {
    this.selectedMarkerValue = this.recordId;
    console.log("Map Loaded", this.recordId);
  }

  handleMarkerSelect(event) {
    this.selectedMarkerValue = event.target.selectedMarkerValue;
  }

  toggleListView() {
    this.listViewValue =
      this.listViewValue === LIST_VIEW_HIDDEN
        ? LIST_VIEW_VISIBLE
        : LIST_VIEW_HIDDEN;
  }
}
