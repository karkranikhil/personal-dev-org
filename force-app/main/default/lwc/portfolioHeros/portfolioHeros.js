import { LightningElement, api, track } from "lwc";
import Assets from "@salesforce/resourceUrl/portfolioPageAssets";
import sendEmail from "@salesforce/apex/EmailUtils.sendEmail";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";

export default class PortfolioHeros extends NavigationMixin(LightningElement) {
  @api navigation;
  @track name;
  @track email;
  @track message;

  //Icons
  meCircle = Assets + "/MeCircle.png";
  meFull = Assets + "/MeFull.jpg";
  fiverrIcon = Assets + "/FiverrIcon.svg";
  linkedinIcon = Assets + "/LinkedinIcon.svg";
  //Photos
  meFull = Assets + "/MeFull.jpg";
  meFull = Assets + "/MeFull.jpg";
  //Projects
  stripeCheckout = Assets + "/StripeCheckout.jpg";
  dataVisualizer = Assets + "/dataVisualizer.jpg";
  scanner = Assets + "/scanner.jpg";
  notification = Assets + "/notification.png";
  experienceSite = Assets + "/experienceSite.jpg";
  dashboard = Assets + "/dashboard.jpg";

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

  handleSubmit(event) {
    // Prevent the default form submission.
    this.isLoading = true;
    event.preventDefault();
    let submitBtn = this.template.querySelector("input.submit");
    submitBtn.classList.add("disabled");
    submitBtn.disabled = true;
    // Get the form data.
    const formData = new FormData(event.target);

    // Call the Apex action method to send the email.
    sendEmail({
      name: formData.get("name"),
      mail: formData.get("email"),
      message: formData.get("message")
    })
      .then((result) => {
        // Handle the result of the action method.
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Message sent!",
            message: "Thanks for considering me. I will reach to you shortly.",
            variant: "success",
            mode: "sticky"
          })
        );
        // Clear the form.
        this.template.querySelector("form").reset();
      })
      .catch((error) => {
        // Handle any errors.
        console.error(error);
      })
      .finally(() => {
        submitBtn.classList.remove("disabled");
        submitBtn.disabled = false;
        const targetElement = this.template.querySelector(".home");
        // Scroll to the target element.
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      });
  }
}
