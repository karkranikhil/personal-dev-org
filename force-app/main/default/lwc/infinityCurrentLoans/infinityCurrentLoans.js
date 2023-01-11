import { LightningElement, track, api, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import getLoans from "@salesforce/apex/InfinityCurrentLoansController.getLoans";

const COLUMNS = [
  { label: "Borrower", fieldName: "borrower" },
  { label: "Security Property", fieldName: "securityProperty" },
  {
    label: "Loan Amount",
    fieldName: "loanAmount",
    type: "currency"
  },
  { label: "Lender", fieldName: "lender" },
  { label: "Interest Rate", fieldName: "interestRate" },
  {
    label: "Current LVR (%)",
    fieldName: "currentLVR",
    type: "percent",
    typeAttributes: {
      step: "0.01",
      minimumFractionDigits: "2",
      maximumFractionDigits: "2"
    }
  },
  {
    label: "Expiry",
    fieldName: "expiry",
    type: "date",
    typeAttributes: {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }
  },
  {
    label: "Actions",
    type: "button-icon",
    initialWidth: 75,
    typeAttributes: {
      iconName: "utility:automate",
      title: "View Record",
      variant: "bare",
      alternativeText: "View",
      name: "view"
    }
  }
];

export default class InfinityCurrentLoans extends NavigationMixin(
  LightningElement
) {
  @api tableTitle;
  @track loans;

  @track columns = COLUMNS;
  isLoading = true;

  @wire(getLoans)
  wiredLoans({ error, data }) {
    if (data) {
      console.log("@@data: ", JSON.parse(JSON.stringify(data)));
      this.loans = [...data];
    } else if (error) {
      console.error(error);
    }
    this.isLoading = false;
  }

  handleRowAction(event) {
    if (event.detail.action.name === "view") {
      this.viewRecord(event.detail.row);
    }
  }

  viewRecord(row) {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        actionName: "view",
        recordId: row.id,
        objectApiName: "OTF__c"
      }
    });
  }
}
