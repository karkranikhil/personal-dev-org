import { LightningElement, api, track } from "lwc";
import getNavigationItems from "@salesforce/apex/esNavigationController.getNavigationItems";
import BASE_PATH from "@salesforce/community/basePath";

export default class EsNavigationTiles extends LightningElement {
  @api fontColor;
  @api backgroundColor;
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
    getNavigationItems({ NavigationDeveleoperName: this.navigation }).then(
      (response) => {
        console.log("Nav Items", JSON.parse(JSON.stringify(response)));
        this.navigationItems = [...response];
        this.setTiles();
      }
    );
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

    this.tiles = tiles.map((item, index) => ({
      ...item,
      Id: this.navigationItems[index].Id,
      title: this.navigationItems[index].Label,
      image: item.image,
      description: item.description
    }));
  }
  navigate(event) {
    let id = event.target.name;
    let nav = this.navigationItems.find((item) => item.Id === id);
    console.log("Clicked", JSON.parse(JSON.stringify(nav)));
    switch (nav.Type) {
      case "SalesforceObject":
        console.log("SalesforceObject");
        break;
      case "InternalLink":
        console.log("Internal");
        break;
      case "ExternalLink":
        console.log("External");
        break;
      default:
        console.log("Other");
        break;
    }
  }
}
