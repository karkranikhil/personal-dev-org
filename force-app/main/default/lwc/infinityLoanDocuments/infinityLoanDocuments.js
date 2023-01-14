import { api, track, LightningElement } from "lwc";
import getExistingDocuments from "@salesforce/apex/InfinityCurrentLoansController.getExistingDocuments";
import getLoginURL from "@salesforce/apex/InfinityCurrentLoansController.getLoginURL";
const DOWNLOAD_URL_PREFIX = "/sfc/servlet.shepherd/version/download/";
const PREVIEW_URL_PREFIX =
  "sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=";
export default class InfinityLoanDocuments extends LightningElement {
  @api recordId;
  @track error;
  @track documents = null;
  isLoading = true;

  connectedCallback() {
    this.handleFetch();
  }

  getBaseUrl() {
    let baseUrl = "https://" + location.host + "/";
    getLoginURL()
      .then((result) => {
        baseUrl = result;
      })
      .catch((error) => {
        console.error(error);
      });
    return baseUrl;
  }

  handleFetch() {
    getExistingDocuments({ recordId: this.recordId })
      .then((result) => {
        console.log("@@ Loan documents", JSON.parse(JSON.stringify(result)));
        if (result.length > 0) {
          let baseUrl = this.getBaseUrl();
          this.documents = result.map((doc) => ({
            Id: doc.ContentDocumentId,
            url:
              DOWNLOAD_URL_PREFIX +
              doc.ContentDocument.LatestPublishedVersionId +
              "?operationContext=S1",
            previewUrl:
              baseUrl +
              PREVIEW_URL_PREFIX +
              doc.ContentDocument.LatestPublishedVersion.Id,
            name: doc.ContentDocument.LatestPublishedVersion.Title,
            extension: doc.ContentDocument.FileExtension,
            isViewable: !doc.ContentDocument.FileType.startsWith("image")
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
