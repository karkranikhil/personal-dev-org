import { LightningElement, api } from "lwc";
export default class InfoCardList extends LightningElement {
  @api cards;
  hasRendered = false;

  renderedCallback() {
    if (!this.hasRendered) {
      if (this.cards !== undefined) {
        console.log(JSON.parse(JSON.stringify(this.cards)));
        let focus = this.cards.find((card) => card.focused);
        if (focus) {
          let cardFocused = null;
          let container = this.template.querySelector(".container");
          this.template.querySelectorAll(".item").forEach((item) => {
            if (focus.Id === item.name) {
              cardFocused = item;
            }
          });
          container.scrollLeft =
            cardFocused.getBoundingClientRect().left -
            container.getBoundingClientRect().left;
        }
      }
    }
    this.hasRendered = true;
  }

  handleClick(event) {
    let Id = event.target.name;
    const e = new CustomEvent("selected", {
      detail: Id
    });
    this.dispatchEvent(e);
  }
}
