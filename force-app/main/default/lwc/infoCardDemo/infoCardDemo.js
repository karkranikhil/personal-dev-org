import { LightningElement, track } from "lwc";
import getAccounts from "@salesforce/apex/InfoCardDemoController.getAccounts";
import getContacts from "@salesforce/apex/InfoCardDemoController.getContacts";

export default class InfoCardDemo extends LightningElement {
  @track contacts;
  @track accounts;

  connectedCallback() {
    getAccounts().then((result) => {
      console.log(JSON.parse(JSON.stringify(result)));
      this.accounts = result.map((account) => ({
        ...account,
        label: account.Name,
        date: account.CreatedDate,
        iconName: "utility:company"
      }));
    });
    getContacts().then((result) => {
      console.log(JSON.parse(JSON.stringify(result)));
      this.contacts = result.map((contact) => ({
        ...contact,
        label: contact.Name,
        date: contact.CreatedDate,
        iconName: "utility:user"
      }));
    });
  }
}
