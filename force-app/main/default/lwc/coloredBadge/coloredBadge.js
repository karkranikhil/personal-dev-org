import { LightningElement, api, wire, track } from "lwc";
import getPicklistValues from "@salesforce/apex/coloredBadgeController.getPicklistValues";
import { getRecord } from "lightning/uiRecordApi";
import TYPE_FIELD from "@salesforce/schema/Account.Type";

const COLORS = [
  "#548CA8",
  "#DF5E5E",
  "#9B72AA",
  "#FFA900",
  "#0A1931",
  "#053742",
  "#444444",
  "#C84B31",
  "#BF1363",
  "#3B14A7",
  "#00EAD3",
  "#4A1C40",
  "#000000",
  "#766161"
];

const DEFAULT_COLOR = "#393E46";

export default class ColoredBadge extends LightningElement {
  @api objectApiName;
  @api recordId;
  @track account;
  value = "Not Assigned"; //* Default value of the Field
  color = DEFAULT_COLOR; //* Default value of the Badge
  @wire(getRecord, { recordId: "$recordId", fields: [TYPE_FIELD] })
  wiredRecord({ error, data }) {
    if (data) {
      this.account = data;
      this.value = data.fields.Type.value
        ? data.fields.Type.value
        : "Not Value Assigned";
      this.getPicklistValues();
    }
  }
  connectedCallback() {
    this.getPicklistValues();
  }
  renderedCallback() {
    this.changeBadgeColor();
  }
  //? Changes the color of the badge
  changeBadgeColor() {
    let badge = this.template.querySelector(".badge");
    let color = "background-color:" + this.color;
    badge.style = color;
  }
  //? This method gets the options selected, and matches them with the array of Colors by its index.
  //! THE MATCH WORKS BY ORDER, SO IF THE ORDER OF THE OPTIONS CHANGES, THE COLOR MATHING WILL CHANGE TOO
  handleColorAssignement(options) {
    let index = options.indexOf(this.value);
    console.log("The correct color is: ", COLORS[index]);
    this.color = COLORS[index] ? COLORS[index] : DEFAULT_COLOR;
    this.changeBadgeColor();
  }

  //? This method uses the Object Api Name and the required Field to get the picklist values
  getPicklistValues() {
    getPicklistValues({
      objectApiName: this.objectApiName,
      fieldApiName: TYPE_FIELD.fieldApiName
    })
      .then((result) => {
        this.handleColorAssignement(result);
      })
      .catch((error) => console.log(error));
  }
}
