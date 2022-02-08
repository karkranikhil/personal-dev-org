import { LightningElement, api, track } from "lwc";
import getNavigationItems from "@salesforce/apex/esNavigationController.getNavigationItems";
import BASE_PATH from "@salesforce/community/basePath";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
export default class EsNavigationTiles extends NavigationMixin(
  LightningElement
) {
  @api fontColor;
  @api backgroundColor;
  @api backgroundHeight;
  @api shadowColor;

  @api firstImagePath;
  @api firstDescription;
  @api secondImagePath;
  @api secondDescription;
  @api thirdImagePath;
  @api thirdDescription;
  @api fourthImagePath;
  @api fourthDescription;

  @api fifthImagePath;
  @api fifthDescription;
  @api sixthImagePath;
  @api sixthDescription;

  @api navigation;

  @track navigationItems;
  @track tiles;
  baseURL;
  connectedCallback() {
    this.baseURL = window.location.origin + BASE_PATH;
    console.log("Base URL", this.baseURL);
    getNavigationItems({ NavigationDeveleoperName: this.navigation })
      .then((response) => {
        console.log("Nav Items", JSON.parse(JSON.stringify(response)));
        if (response.length > 6) {
          this.notifyUser(
            "Error",
            "Cannot set more than 6 Navigation Tiles",
            "error"
          );
        } else {
          this.navigationItems = [...response];
        }
        this.setTiles();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  setTiles() {
    let tiles = [
      {
        image: this.firstImagePath,
        description: this.firstDescription
      },
      {
        image: this.secondImagePath,
        description: this.secondDescription
      },
      {
        image: this.thirdImagePath,
        description: this.thirdDescription
      },
      {
        image: this.fourthImagePath,
        description: this.fourthDescription
      },
      {
        image: this.fifthImagePath,
        description: this.fifthDescription
      },
      {
        image: this.sixthImagePath,
        description: this.sixthDescription
      }
    ];

    this.tiles = this.navigationItems.map((item, index) => ({
      Id: item.Id,
      title: item.Label,
      image: tiles[index].image,
      description: tiles[index].description
    }));
  }
  navigate(event) {
    let id = event.target.name;
    let nav = this.navigationItems.find((item) => item.Id === id);
    console.log("Clicked", JSON.parse(JSON.stringify(nav)));
    switch (nav.Type) {
      case "SalesforceObject":
        console.log("SalesforceObject", nav.Target);
        this.navigateToObject(nav.Target);
        break;
      case "InternalLink":
        console.log("Internal");
        window.location.href += nav.Target.replace("/", "");
        break;
      case "ExternalLink":
        console.log("External");
        window.location.href = nav.Target;
        break;
      case "Event":
        if (nav.Target === "Logout") {
          this.logout();
        }
        if (nav.Target === "Login") {
          this.login();
        }
        window.location.href = nav.Target;
        break;
      default:
        console.log("Other");
        break;
    }
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
  logout() {
    this[NavigationMixin.Navigate]({
      type: "comm__loginPage",
      attributes: {
        actionName: "logout"
      }
    });
  }
  login() {
    this[NavigationMixin.Navigate]({
      type: "comm__loginPage",
      attributes: {
        actionName: "login"
      }
    });
  }

  notifyUser(title, message, variant) {
    const toastEvent = new ShowToastEvent({ title, message, variant });
    this.dispatchEvent(toastEvent);
  }
}
