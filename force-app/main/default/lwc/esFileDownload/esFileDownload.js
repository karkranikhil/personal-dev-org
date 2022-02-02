import { LightningElement, api } from "lwc";

export default class EsFileDownload extends LightningElement {
  @api name;
  @api extension;
  @api url;
  @api tooltip;
  @api icon;
  textDisplay;

  connectedCallback() {
    this.textDisplay =
      this.truncateString(this.name, 20) + "." + this.extension;
  }

  truncateString(str, num) {
    return str.length > num
      ? str.slice(0, num > 3 ? num - 3 : num) + "..."
      : str;
  }
}
