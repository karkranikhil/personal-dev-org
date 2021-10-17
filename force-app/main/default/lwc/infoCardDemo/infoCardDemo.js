import { LightningElement, track } from "lwc";
import getAccounts from "@salesforce/apex/InfoCardDemoController.getAccounts";
import getContacts from "@salesforce/apex/InfoCardDemoController.getContacts";

export default class InfoCardDemo extends LightningElement {
  @track contacts;
  @track accounts;

  connectedCallback() {
    getAccounts().then((result) => {
      this.accounts = result.map((account, index) => ({
        ...account,
        label: account.Name,
        date: account.CreatedDate,
        iconName: "utility:company",
        focused: false, //?Set all to false if none should be focused, so the scroll starts at the left corner
        checked: index === 1 ? true : false, //? Set true the element you want to highlight (in this scenario, the element with index 1)
        highlighted: index === 0 ? true : false //? Set true the element you want to highlight (in this scenario, the element with index 1)
      }));

      console.log(JSON.parse(JSON.stringify(this.accounts)));
    });
    getContacts().then((result) => {
      this.contacts = result.map((contact, index) => ({
        ...contact,
        label: contact.Name,
        date: contact.CreatedDate,
        iconName: "utility:user",
        focused: index === 5 ? true : false //? Set true the element you want to focus (in this scenario, the element with index 5)
      }));
    });
  }

  handleAccountSelect(event) {
    let Id = event.detail;
    console.log("Account Id Selected:", Id);
  }
  handleContactSelect(event) {
    let Id = event.detail;
    console.log("Contact Id Selected:", Id);
  }
}
