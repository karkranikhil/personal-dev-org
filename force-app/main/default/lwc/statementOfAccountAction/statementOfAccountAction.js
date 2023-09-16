import { LightningElement, api, wire, track } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import FIRSTNAME_FIELD from "@salesforce/schema/Contact.FirstName";
import LASTNAME_FIELD from "@salesforce/schema/Contact.LastName";
import EMAIL_FIELD from "@salesforce/schema/Contact.Email";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { CloseActionScreenEvent } from "lightning/actions";
import isValid from "@salesforce/apex/StatementOfAccountController.isValid";
import SaveAndEmail from "@salesforce/apex/StatementOfAccountController.saveAndEmail";
import fetchPaymentsByContact from "@salesforce/apex/StatementOfAccountController.fetchPaymentsByContact";
import USER_ID from "@salesforce/user/Id";

const ENABLED_PROFILES = [
  "System Administrator",
  "PB Cana Rock Finanzas",
  "PB Administrator"
];

export default class StatementOfAccountAction extends LightningElement {
  @api recordId;
  @api objectApiName;
  @track contact;
  @track isSendButtonDisabled = true;
  @track isNextStepButtonDisabled = true;
  @track includeReceipts = false; // Variable to decide if receipts should be included in the PDF  @track paymentList;
  @track paymentList;
  @track selectedPaymentIds = [];
  profileName;
  isValid = false;
  isLoading = true;
  isSending = false;
  showPdf = false;

  columns = [
    {
      label: "Incluir?",
      type: "button-icon",
      fixedWidth: 75,
      typeAttributes: {
        label: "Include",
        iconName: { fieldName: "toggleIcon" },
        class: "slds-current-color",
        name: "toggle",
        variant: { fieldName: "toggleIconVariant" }
      }
    },
    { label: "Titulo", fieldName: "Name" },
    {
      label: "Listing Adquirido",
      fieldName: "Listing_Adquirido_Name__c",
      type: "text",
      initialWidth: 200
    },
    {
      label: "Cantidad Total",
      fieldName: "pba_financial__Total_Amount__c",
      type: "currency",
      initialWidth: 180
    }
  ];

  @wire(getRecord, {
    recordId: USER_ID,
    fields: ["User.Profile.Name"]
  })
  wiredProfile({ error, data }) {
    if (error) {
      this.dispatchEvent(
        new ShowToastEvent({
          title: "Error",
          message: "There was an error getting the profile information.",
          variant: "error"
        })
      );
    } else if (data) {
      console.log("data: ", data);
      this.profileName = data.fields.Profile.value.fields.Name.value;
      console.log("@@ profileName: ", this.profileName);
      this.isSendButtonDisabled = !ENABLED_PROFILES.includes(this.profileName);
    }
  }

  @wire(getRecord, {
    recordId: "$recordId",
    fields: [FIRSTNAME_FIELD, LASTNAME_FIELD, EMAIL_FIELD]
  })
  wiredContact({ error, data }) {
    if (error) {
      this.dispatchEvent(
        new ShowToastEvent({
          title: "Error",
          message: "There was an error getting the contact information.",
          variant: "error"
        })
      );
    } else if (data) {
      this.contact = { ...data };
      isValid({ contactId: this.recordId })
        .then((valid) => {
          this.isValid = valid;
          fetchPaymentsByContact({ contactId: this.recordId })
            .then((result) => {
              console.log("@@ paymentresult: ", result);
              this.paymentList = result.map((row) => {
                row.toggleIcon = this.selectedPaymentIds.includes(row.Id)
                  ? "utility:check"
                  : "utility:add";
                row.toggleIconVariant = this.selectedPaymentIds.includes(row.Id)
                  ? "brand"
                  : "border";
                return row;
              });
              console.log(
                "@@ paymentList: ",
                JSON.parse(JSON.stringify(this.paymentList))
              );
            })
            .catch((error) => {
              console.error(error);
              this.dispatchEvent(
                new ShowToastEvent({
                  title: "Error",
                  message:
                    "There was an error getting the Payments information.",
                  variant: "error"
                })
              );
            });
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }

  get firstName() {
    return this.contact ? this.contact.fields.FirstName.value : null;
  }

  get lastName() {
    return this.contact ? this.contact.fields.LastName.value : null;
  }
  get email() {
    return this.contact ? this.contact.fields.Email.value : null;
  }

  get invoicePdfUrl() {
    return `/apex/statementOfAccountPDF?contactId=${this.recordId}`;
  }
  // Helper Function to Update selectedPaymentIds Array
  updateSelectedPaymentIds(rowId) {
    const index = this.selectedPaymentIds.indexOf(rowId);
    if (index > -1) {
      this.selectedPaymentIds.splice(index, 1);
    } else {
      this.selectedPaymentIds.push(rowId);
    }
    // Trigger reactivity by assigning a new copy of the array
    this.isNextStepButtonDisabled = this.selectedPaymentIds.length == 0;
    return [...this.selectedPaymentIds];
  }

  // Helper Function to Force Data Table Rerender
  forceRerender(data) {
    this.paymentList = undefined;
    return this.updateToggleIcons(data);
  }

  handleRowAction(event) {
    const actionName = event.detail.action.name;
    const rowId = event.detail.row.Id;

    if (actionName === "toggle") {
      // Update selectedPaymentIds and rerender datatable
      this.selectedPaymentIds = this.updateSelectedPaymentIds(rowId);
      this.paymentList = this.forceRerender([...this.paymentList]);
      console.log(
        "@@ selectedPaymentIds: ",
        JSON.parse(JSON.stringify(this.selectedPaymentIds))
      );
    }
  }

  updateToggleIcons(paymentData) {
    return paymentData.map((row) => {
      row.toggleIcon = this.selectedPaymentIds.includes(row.Id)
        ? "utility:check"
        : "utility:add";
      row.toggleIconVariant = this.selectedPaymentIds.includes(row.Id)
        ? "brand"
        : "border";
      return row;
    });
  }

  handleGeneratePDFWithoutReceipts() {
    this.includeReceipts = false;
    this.navigateToNextStep();
  }

  handleGeneratePDFWithReceipts() {
    this.includeReceipts = true;
    this.navigateToNextStep();
  }

  // Method to navigate to the next step. Implementation depends on your specific requirement
  navigateToNextStep() {
    this.showPdf = true;
  }

  handleCancel() {
    this.dispatchEvent(new CloseActionScreenEvent());
  }

  handleSaveAndEmail() {
    this.isSending = true;
    SaveAndEmail({ recordId: this.recordId })
      .then(() => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Email Sent",
            message: "File sent successfuly",
            variant: "success"
          })
        );
      })
      .catch((error) => {
        console.log("error: ", error);
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error",
            message: "Error saving file",
            variant: "error"
          })
        );
      })
      .finally(() => {
        this.isSending = false;
        this.dispatchEvent(new CloseActionScreenEvent());
      });
  }
}
