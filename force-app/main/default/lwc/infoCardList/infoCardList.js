import { LightningElement, api } from "lwc";
export default class InfoCardList extends LightningElement {
  @api cards = [];

  handleClick(event) {
    let Id = event.target.name;
    const e = new CustomEvent("selected", {
      detail: Id
    });
    this.dispatchEvent(e);
  }
}
