import { api, track, LightningElement } from "lwc";
import getLoanByRecordId from "@salesforce/apex/InfinityCurrentLoansController.getLoanByRecordId";

export default class InfinityLoanDetails extends LightningElement {
  @api recordId;
  @track loan = null;
  @track error;
  isLoading = true;

  connectedCallback() {
    this.handleFetch();
  }
  handleFetch() {
    getLoanByRecordId({ recordId: this.recordId })
      .then((result) => {
        console.log("@@ Loan Data", JSON.parse(JSON.stringify(result)));
        this.loan = { ...result };
        console.log("this.loan: ", JSON.parse(JSON.stringify(this.loan)));
      })
      .catch((error) => {
        console.error("@@error: ", JSON.parse(JSON.stringify(error)));
        this.load = null;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
