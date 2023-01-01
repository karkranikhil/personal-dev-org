import { LightningElement, track, api } from "lwc";

export default class PortfolioHeader extends LightningElement {
  @api textColor;
  @api mainColor;
  @api navigation;
  @track navigationItems = [];
  hasRendered = false;
  isMenuOpen = false;

  connectedCallback() {
    this.setNavigationItems();
  }

  renderedCallback() {
    //?Change Colors and Height
    if (!this.hasRendered) {
      let header = this.template.querySelector("header");
      window.addEventListener("scroll", function () {
        header.classList.toggle("sticky", window.scrollY > 100);
      });
      header.style.setProperty("--textColor", this.textColor);
      header.style.setProperty("--mainColor", this.mainColor);

      let menu = this.template.querySelector(".menu-icon");
      let navlist = this.template.querySelector(".navlist");

      menu.onclick = () => {
        this.isMenuOpen = !this.isMenuOpen;
        navlist.classList.toggle("open");
      };
      window.onscroll = () => {
        menu.classList.remove("bx-x");
        navlist.classList.remove("open");
      };

      this.hasRendered = true;
    }
  }
  handleScrollClick() {
    const topDiv = this.template.querySelector('[data-id="redDiv"]');
    topDiv.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest"
    });
  }
}
