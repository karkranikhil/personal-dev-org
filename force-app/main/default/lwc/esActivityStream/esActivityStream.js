import { LightningElement, track, wire } from "lwc";
import getNotes from "@salesforce/apex/esActivityStreamController.getNotes";
import updateNote from "@salesforce/apex/esActivityStreamController.updateNote";

const OBJECT_OPTIONS = [
  { label: "Contacts", value: "contact" },
  { label: "Leads", value: "lead" },
  { label: "Accounts", value: "account" }
];
export default class EsActivityStream extends LightningElement {
  objectOptions = OBJECT_OPTIONS;
  selectedObject = "contact";
  @track sections = [];
  @track notes;

  //*LIFE CYCLE
  connectedCallback() {
    this.fillDateArray();
  }

  @wire(getNotes, { objectApiName: "$selectedObject" })
  wiredNotes({ error, data }) {
    if (error) {
    } else if (data) {
      let notes = data.map((note) => ({
        ...note,
        isLoading: false,
        time: new Date(note.LastModifiedDate).toLocaleTimeString(),
        url: "/" + note.RecordId
      }));
      this.notes = notes;
      this.arrangeSections();
    }
  }

  //*GETTERS AND SETTERS
  get icon() {
    return "standard:" + this.selectedObject;
  }

  //*UTILITY
  arrangeSections() {
    this.sections = this.sections.map((section) => ({
      ...section,
      length: this.notes.filter((note) =>
        this.isSameDay(section.date, new Date(note.LastModifiedDate))
      ).length,
      notes: this.notes.filter((note) =>
        this.isSameDay(section.date, new Date(note.LastModifiedDate))
      )
    }));
  }
  handleComboboxChange(event) {
    this.selectedObject = event.detail.value;
  }

  handleClick(event) {
    let noteId = event.target.name;
    let note = this.notes.find((note) => note.Id === noteId);
    note.isLoading = true;
    updateNote({ recordId: noteId, value: note.Content })
      .then(() => {
        note.isModified = false;
        note.LastModifiedDate = new Date();
        note.time = new Date(note.LastModifiedDate).toLocaleTimeString();
        this.notes.sort((a, b) =>
          new Date(b.LastModifiedDate) > new Date(a.LastModifiedDate) ? 1 : -1
        );
        this.arrangeSections();
      })
      .finally(() => (note.isLoading = false));
  }

  handleChange(event) {
    let noteId = event.target.name;
    let value = event.target.value;
    let note = this.notes.find((filteredNote) => filteredNote.Id === noteId);
    note.Content = value;
    note.isModified = note.originalValue !== value;
  }

  isSameDay(d1, d2) {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }
  fillDateArray() {
    let today = new Date();
    let priorDate = new Date().setDate(today.getDate() - 90);
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
