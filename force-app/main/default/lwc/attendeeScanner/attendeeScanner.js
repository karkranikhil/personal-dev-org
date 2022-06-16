/* eslint-disable @lwc/lwc/no-async-operation */
// barcodeScannerExample.js
import { LightningElement, api, track, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { getBarcodeScanner } from "lightning/mobileCapabilities";
import getCampaing from "@salesforce/apex/AttendeeScannerController.getCampaing";
import getContact from "@salesforce/apex/AttendeeScannerController.getContact";
import createCampaignMember from "@salesforce/apex/AttendeeScannerController.createCampaignMember";
const VALID_QR_IDENTIFIER = "recordId:";

const SCANNER_INSTRUCTIONS = "Scan barcodes — Click ✖︎ when done";
const SCANNER_SUCCESS_MESSAGE = "Successful scan.";
const SCANNER_UNAVAILABLE_MESSAGE = "Scanner Unavailable";

const SCANNER_DELAY_BETWEEN_SCANS = 1000;

export default class AttendeeScanner extends LightningElement {
  @api recordId;
  @track scannedBarcodes;
  @track scannedIds = [];
  @track contacts;
  @track campaign;
  sessionScanner;
  isScanDisabled = false;

  //* LIFECYCLE
  connectedCallback() {
    console.log("recordID", this.recordId);
    getCampaing({ recordId: this.recordId })
      .then((result) => {
        this.campaign = result;
      })
      .catch((error) => this.handleError(error));
    this.sessionScanner = getBarcodeScanner();
    if (!this.sessionScanner.isAvailable()) {
      this.isScanDisabled = true;
    }
  }

  //* SCANNING SESSION
  beginScanning() {
    // Reset scannedBarcodes before starting new scanning session
    this.scannedBarcodes = [];
    this.scannedIds = [];
    this.contacts = [];

    // Make sure BarcodeScanner is available before trying to use it
    if (this.sessionScanner != null && this.sessionScanner.isAvailable()) {
      const scanningOptions = {
        barcodeTypes: [this.sessionScanner.barcodeTypes.QR],
        instructionText: SCANNER_INSTRUCTIONS,
        successText: SCANNER_SUCCESS_MESSAGE
      };
      this.sessionScanner
        .beginCapture(scanningOptions)
        .then((scannedBarcode) => {
          this.processScannedBarcode(scannedBarcode);
          this.continueScanning();
        })
        .catch((error) => {
          this.processError(error);
          this.sessionScanner.endCapture();
        });
    } else {
      this.isScanDisabled = true;
      this.showToast(
        SCANNER_UNAVAILABLE_MESSAGE,
        "QR Scanner unavailable. Non-mobile device?",
        "warning"
      );
    }
  }

  async continueScanning() {
    // Pretend to do some work; see timing note below.
    await new Promise((resolve) =>
      setTimeout(resolve, SCANNER_DELAY_BETWEEN_SCANS)
    );

    this.sessionScanner
      .resumeCapture()
      .then((scannedBarcode) => {
        this.processScannedBarcode(scannedBarcode);
        this.continueScanning();
      })
      .catch((error) => {
        this.processError(error);
        this.sessionScanner.endCapture();
      });
  }

  //* PROCESS SCAN
  processScannedBarcode(barcode) {
    console.log(JSON.stringify(barcode));
    //?If the QR Is not the one we defined
    if (!barcode.value.includes(VALID_QR_IDENTIFIER)) {
      this.showToast("Invalid", "Invalid QR for Attendee", "error");
      return;
    }
    //?Get the contactId
    const recordId = barcode.value.substring(barcode.value.indexOf(":") + 1);
    //?Contact already scanned on this session
    if (this.scannedIds.includes(recordId)) {
      this.showToast(
        "Duplicate",
        "This Attendee was already scanned in this session",
        "warning"
      );
      return;
    }
    //TODO: Add member to campaing
    this.scannedBarcodes.push(barcode);
    this.scannedIds = [...this.scannedIds, recordId];
    this.addContactToCampaign(recordId);
  }

  handleScannedContact(contactId) {
    getContact({ recordId: contactId }).then((result) => {
      this.contacts = [...this.contacts, result];
    });
  }

  addContactToCampaign(contactId) {
    createCampaignMember({
      campaignId: this.recordId,
      contactId
    })
      .then(() => {
        this.handleScannedContact(contactId);
      })
      .catch((error) => this.handleError(error));
  }

  //* UTILITY
  showToast(title, message, variant) {
    this.dispatchEvent(
      new ShowToastEvent({
        title,
        message,
        variant
      })
    );
  }
  handleError(error) {
    console.error(error);
    let message = "Unknown error";
    if (Array.isArray(error.body)) {
      message = error.body.map((e) => e.message).join(", ");
    } else if (typeof error.body.message === "string") {
      message = error.body.message;
    }
    this.showToast("Error", message, "error");
  }
  processError(error) {
    // Check to see if user ended scanning
    if (error.code === "userDismissedScanner") {
      this.showToast(
        SCANNER_UNAVAILABLE_MESSAGE,
        "User terminated scanning session via Cancel.",
        "info"
      );
    } else {
      console.error(error);
    }
  }
}
