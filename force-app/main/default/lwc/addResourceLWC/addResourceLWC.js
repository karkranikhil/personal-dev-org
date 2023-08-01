import { LightningElement, api, track, wire } from "lwc";
import getResourceRecords from "@salesforce/apex/addResourceController.getServiceResource";
import SaveAppointment from "@salesforce/apex/addResourceController.saveAppointment";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";

const columns = [
  { label: "Name", fieldName: "ResourceName" },
  {
    label: "Distance (km)",
    fieldName: "Distance",
    sortable: true,
    type: "Decimal"
  },
  { label: "Email", fieldName: "Email" },
  { label: "Employment Status", fieldName: "EmploymentStatus" },
  { label: "Resource Type", fieldName: "ResourceType" }
];

export default class AddResourceLWC extends LightningElement {
  @api recordId;
  columns = columns;
  @track data;
  @track resourceid;
  viewRecords = true;
  viewResource = false;
  Loading = true;
  @track norecordsFound = "";
  @track selectedRecords = [];
  @track sortBy = "Distance";
  @track sortDirection = "asc";
  @track defaultSortDirection = "asc";

  connectedCallback() {
    this.Loading = true;
  }

  doSorting(event) {
    this.sortBy = event.detail.fieldName;
    this.sortDirection = event.detail.sortDirection;
    this.sortData(this.sortBy, this.sortDirection);
  }

  sortData(fieldname, direction) {
    let parseData = JSON.parse(JSON.stringify(this.data));
    let keyValue = (a) => {
      return a[fieldname];
    };
    let isReverse = direction === "asc" ? 1 : -1;
    parseData.sort((x, y) => {
      x = keyValue(x) ? keyValue(x) : "";
      y = keyValue(y) ? keyValue(y) : "";
      return isReverse * ((x > y) - (y > x));
    });
    this.data = parseData;
  }

  @wire(getResourceRecords, { strAppointmentId: "$recordId" })
  getResource({ error, data }) {
    if (error) {
      console.error("Error fetching resource data:", JSON.stringify(error));
      this.Loading = false;
    } else if (data) {
      console.log("Data from Apex:", JSON.parse(JSON.stringify(data)));
      if (data.length > 0) {
        this.data = data;
        this.sortData("Distance", "asc");
        this.viewResource = true;
      } else {
        this.viewResource = false;
        this.norecordsFound = "No Resource Found";
      }
      this.Loading = false;
    }
  }

  handleclose() {
    this.Loading = true;
    this.viewRecords = false;
    window.history.back();
  }

  handleSave() {
    this.Loading = true;
    this.selectedRecords = this.template
      .querySelector("lightning-datatable")
      .getSelectedRows();
    if (this.selectedRecords.length === 0) {
      const event = new ShowToastEvent({
        title: "",
        message: "Please Select Resource",
        variant: "warning",
        mode: "dismissable"
      });
      this.dispatchEvent(event);
      this.Loading = false;
      return;
    }

    SaveAppointment({
      strRecordId: this.recordId,
      strLstSerResource: this.selectedRecords
    })
      .then((result) => {
        console.log("SaveAppointment response:", JSON.stringify(result));
        this[NavigationMixin.Navigate]({
          type: "standard__recordPage",
          attributes: {
            recordId: this.recordId,
            objectApiName: "ServiceAppointment",
            actionName: "view"
          }
        });
        this.Loading = false;
      })
      .catch((error) => {
        console.error("SaveAppointment error:", JSON.stringify(error));
        window.history.back();
        this.Loading = false;
      });
  }
}
