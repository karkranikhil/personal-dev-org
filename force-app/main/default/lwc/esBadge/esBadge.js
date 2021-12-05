import { LightningElement, api } from "lwc";

export default class EsBadge extends LightningElement {
  @api label;
  @api variant = "default";
  isDefault = false;
  isLight = false;
  isDark = false;
  isSuccess = false;
  isWarning = false;
  isError = false;
  connectedCallback() {
    switch (this.variant) {
      case "light":
        this.isLight = true;
        break;
      case "dark":
        this.isDark = true;
        break;
      case "success":
        this.isSuccess = true;
        break;
      case "warning":
        this.isWarning = true;
        break;
      case "error":
        this.isError = true;
        break;

      default:
        this.isDefault = true;
        break;
    }
  }
}
