import { LightningElement } from "lwc";
import RESOURCES from "@salesforce/resourceUrl/propernyeResources";

export default class PropernyeFooter extends LightningElement {
  iconUrl = RESOURCES + "/images/fingers.png";
  brandsURl = RESOURCES + "/images/crssd-proper-lineup-p2.jpg";
  barcodeUrl = RESOURCES + "/images/proper-footer.jpg";
}
