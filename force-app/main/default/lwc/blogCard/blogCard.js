import { LightningElement, api } from "lwc";

export default class BlogCard extends LightningElement {
  @api headerTitle = "Header Title";
  @api cardIcon = "utility:notebook";
  @api color = "#0c4271";
  @api sections = [];

  renderedCallback() {
    let titles = this.template.querySelectorAll(".section-title");
    let header = this.template.querySelector(".card-header");
    let color = "background-color:" + this.color;
    titles.forEach((title) => {
      title.style = color;
    });
    header.style = color;
    // header.style.background = this.color;
  }
}
