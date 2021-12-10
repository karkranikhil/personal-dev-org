import { LightningElement, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
export default class EsChecklistTabset extends LightningElement {
  @api recordId;
  loading = true;

  renderedCallback() {
    this.setLoading(false);
  }

  //* Form Handling
  handleSubmit() {
    this.setLoading(true);
  }
  handleSuccess() {
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Success",
        message: "Record Updated",
        variant: "success"
      })
    );
    this.setLoading(false);
  }
  handleError(event) {
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Error",
        message: event.detail.message,
        variant: "error"
      })
    );
    this.setLoading(false);
  }

  //* Utility
  setLoading(state) {
    this.loading = state;
  }
}
