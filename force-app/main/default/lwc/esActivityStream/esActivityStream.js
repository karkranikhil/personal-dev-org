import { LightningElement, track, wire } from "lwc";
import getNotes from "@salesforce/apex/esActivityStreamController.getNotes";
const OBJECT_OPTIONS = [
  { label: "Contacts", value: "contact" },
  { label: "Leads", value: "lead" },
  { label: "Accounts", value: "account" }
];
export default class EsActivityStream extends LightningElement {
  objectOptions = OBJECT_OPTIONS;
  selectedObject = "contact";
  @track sections = [];

  //*LIFE CYCLE
  connectedCallback() {
    this.fillDateArray();
    console.log("Last30Days: ", JSON.parse(JSON.stringify(this.sections)));
  }

  @wire(getNotes, { objectApiName: "$selectedObject" })
  wiredNotes({ error, data }) {
    if (error) {
      console.error(error);
    } else if (data) {
      console.log("data");
      console.log("Response", JSON.parse(JSON.stringify(data)));
    }
    console.log("....");
  }

  //*GETTERS AND SETTERS
  get icon() {
    return "standard:" + this.selectedObject;
  }

  //*UTILITY
  handleComboboxChange(event) {
    this.selectedObject = event.detail.value;
  }

  handleClick(event) {
    console.log("Save");
  }

  fillDateArray() {
    let today = new Date();
    let priorDate = new Date().setDate(today.getDate() - 30);
    priorDate = new Date(priorDate);
    while (priorDate <= today) {
      this.sections.push({
        date: new Date(priorDate),
        title: new Date(priorDate).toLocaleDateString(),
        length: 0
      });
      priorDate.setDate(priorDate.getDate() + 1);
    }
    this.sections.reverse();
    this.sections[0].title = "Today";
    this.sections[1].title = "Yesterday";
  }
}
