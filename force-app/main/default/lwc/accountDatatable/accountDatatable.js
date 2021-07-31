import { LightningElement, api, wire, track } from "lwc";
import getAccountList from "@salesforce/apex/accountDatatableController.getAccountList";
export default class AccountDatatable extends LightningElement {
  @track columns = [
    {
      label: "Id",
      fieldName: "idUrl",
      type: "url",
      typeAttributes: { label: { fieldName: "Id" }, target: "_self" }
    },
    {
      label: "Account name",
      fieldName: "name",
      type: "text",
      sortable: true
    },

    {
      label: "Type",
      fieldName: "Type",
      type: "text",
      sortable: true
    },
    {
      label: "Mass Times",
      fieldName: "MassTimes",
      type: "text",
      sortable: true
    }
  ];

  @track error;
  @track accList;
  @wire(getAccountList)
  wiredAccounts({ error, data }) {
    if (data) {
      this.accList = data;
      console.log(data);
    } else if (error) {
      this.error = error;
      console.log(error);
    }
  }
}
