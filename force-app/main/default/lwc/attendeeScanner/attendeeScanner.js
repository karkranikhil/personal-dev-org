/* eslint-disable @lwc/lwc/no-async-operation */
// barcodeScannerExample.js
import { LightningElement, api, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { getBarcodeScanner } from "lightning/mobileCapabilities";

const QR_TYPE = "qr";
const VALID_QR_IDENTIFIER = "recordId:";

const SCANNER_INSTRUCTIONS = "Scan barcodes — Click ✖︎ when done";
const SCANNER_SUCCESS_MESSAGE = "Successful scan.";

const SCANNER_DELAY_BETWEEN_SCANS = 2500;

export default class AttendeeScanner extends LightningElement {
  @api recordId;
  @track scannedBarcodes;
  @track scannedIds = [];
  sessionScanner;
  isScanDisabled = false;

  connectedCallback() {
    this.sessionScanner = getBarcodeScanner();
    if (!this.sessionScanner.isAvailable()) {
      this.isScanDisabled = true;
    }
  }

  beginScanning() {
    // Reset scannedBarcodes before starting new scanning session
    this.scannedBarcodes = [];

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
        "Scanner Unavailable",
        "BarcodeScanner unavailable. Non-mobile device?",
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

  processScannedBarcode(barcode) {
    console.log(JSON.stringify(barcode));
    // if (barcode.type !== QR_TYPE) return;
    if (!barcode.value.includes(VALID_QR_IDENTIFIER)) {
      this.showToast("Invalid", "Invalid QR for Attendee", "error");
      return;
    }
    const recordId = barcode.value.substring(barcode.value.indexOf(":") + 1);
    if (this.scannedIds.includes(recordId)) {
      this.showToast(
        "Duplicate",
        "This Attendee was already scanned in this session",
        "warning"
      );
      return;
    }

    this.scannedBarcodes.push(barcode);
    this.scannedIds = [...this.scannedIds, recordId];
  }
  processError(error) {
    // Check to see if user ended scanning
    if (error.code === "userDismissedScanner") {
      this.showToast(
        "Scanner Unavailable",
        "User terminated scanning session via Cancel.",
        "info"
      );
    } else {
      console.error(error);
    }
  }

  get scannedIdsAsString() {
    return this.scannedIds.join("\n\n");
  }

  showToast(title, message, variant) {
    this.dispatchEvent(
      new ShowToastEvent({
        title,
        message,
        variant
      })
    );
  }
}
