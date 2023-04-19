import { LightningElement } from "lwc";
import RESOURCES from "@salesforce/resourceUrl/propernyeResources";
import { NavigationMixin } from "lightning/navigation";

export default class PropernyeContent extends NavigationMixin(LightningElement) {
  imageUrl = RESOURCES + "/images/proper-banner.jpg";

  navigateToPage(event) {
    event.preventDefault();
    this[NavigationMixin.Navigate]({
      type: "comm__namedPage",
      attributes: {
        name: "Book_a_Trip__c"
      }
    });
  }
}
