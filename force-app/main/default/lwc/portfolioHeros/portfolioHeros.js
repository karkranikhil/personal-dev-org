import { LightningElement, api, track } from "lwc";
import Assets from "@salesforce/resourceUrl/portfolioPageAssets";
import { NavigationMixin } from "lightning/navigation";

export default class PortfolioHeros extends NavigationMixin(LightningElement) {
  @api navigation;
  meCircle = Assets + "/MeCircle.png";
  meFull = Assets + "/MeFull.jpg";

  isMenuOpen = false;
  hasRendered = false;

  renderedCallback() {
    if (!this.hasRendered) {
      let header = this.template.querySelector("header");
      window.addEventListener("scroll", function () {
        header.classList.toggle("sticky", window.scrollY > 100);
      });

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

  handleScroll(event) {
    const hrefValue = event.target.href;
    // Get the value of the hash from the href value.
    const hash = hrefValue.replace("#", ".");
    // Select the target element using the hash.
    const targetElement = this.template.querySelector(hash);
    // Scroll to the target element.
    targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  navigateToPage(event) {
    let page = event.target.name;
    console.log("page: ", page);
    this[NavigationMixin.Navigate]({
      type: "comm__namedPage",
      attributes: {
        name: page
      }
    });
  }
  navigateToObject(object) {
    this[NavigationMixin.Navigate]({
      type: "standard__objectPage",
      attributes: {
        objectApiName: object,
        actionName: "home"
      }
    });
  }
}
