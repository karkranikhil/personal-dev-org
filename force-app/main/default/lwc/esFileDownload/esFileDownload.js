import { LightningElement, api } from "lwc";
import BASE_PATH from "@salesforce/community/basePath";
import { NavigationMixin } from "lightning/navigation";

export default class EsFileDownload extends NavigationMixin(LightningElement) {
  @api name;
  @api extension;
  @api url;
  @api docId;
  @api previewUrl;
  @api tooltip;
  @api icon;
  textDisplay;
  connectedCallback() {
    this.textDisplay =
      this.truncateString(this.name, 30) + "." + this.extension;
  }

  truncateString(str, num) {
    return str.length > num
      ? str.slice(0, num > 3 ? num - 3 : num) + "..."
      : str;
  }
  handlePreview() {
    this[NavigationMixin.Navigate](
      {
        type: "standard__webPage",
        attributes: {
          url: this.previewUrl
        }
      },
      false
    );
  }
}
