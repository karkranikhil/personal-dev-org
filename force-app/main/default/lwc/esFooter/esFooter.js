import { LightningElement, api } from "lwc";

export default class EsFooter extends LightningElement {
  @api backgroundColor;
  @api headerColor;
  @api fontColor;
  @api firstHeader;
  @api secondHeader;
  @api thirdHeader;
  @api fourthHeader;
  @api firstNavigation;
  @api secondNavigation;
  @api fourthNavigation;

  //* ---------------------- LIFECYCLE METHODS ----------------------//

  renderedCallback() {
    //?Change Colors and Height
    this.template.querySelector(".background").style.backgroundColor =
      this.backgroundColor;
    this.template
      .querySelectorAll(".header")
      .forEach((header) => (header.style.color = this.headerColor));
    this.template
      .querySelectorAll(".link")
      .forEach((link) => (link.style.color = this.fontColor));
  }

  //* ---------------------- UTILITY METHODS ------------------------//

  handleCollapse(event) {
    let collapsible = event.target;
    console.log(collapsible.classList);
    console.log(window.innerWidth);
    if (!collapsible.classList.contains("header") || window.innerWidth >= 768) {
      return;
    }
    collapsible.classList.toggle("active");
    let content = collapsible.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  }
}
