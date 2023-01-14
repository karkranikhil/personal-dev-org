import { api, track, LightningElement } from "lwc";
import getExistingDocuments from "@salesforce/apex/InfinityCurrentLoansController.getExistingDocuments";
const IMG_URL_PREFIX = "/sfc/servlet.shepherd/version/download/";
export default class InfinityLoanDocuments extends LightningElement {
  @api recordId;
  @track error;
  @track documents = null;
  isLoading = true;

  connectedCallback() {
    console.log("@@recordId", this.recordId);
    this.handleFetch();
  }
  handleFetch() {
    getExistingDocuments({ recordId: this.recordId })
      .then((result) => {
        console.log("@@ Loan documents", JSON.parse(JSON.stringify(result)));
        if (result.length > 0) {
          this.documents = result.map((doc) => ({
            url:
              IMG_URL_PREFIX +
              doc.ContentDocument.LatestPublishedVersionId +
              "?operationContext=S1",
            name: doc.ContentDocument.LatestPublishedVersion.Title,
            extension: doc.ContentDocument.FileExtension
          }));
          console.log(
            "@@ This documents",
            JSON.parse(JSON.stringify(this.documents))
          );
        }
      })
      .catch((error) => {
        console.log("@@error: ", JSON.parse(JSON.stringify(error)));
        this.documents = null;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
