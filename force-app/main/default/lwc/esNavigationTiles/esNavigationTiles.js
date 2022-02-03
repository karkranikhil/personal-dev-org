import { LightningElement, api, track } from "lwc";

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

  @track tiles;

  connectedCallback() {
    console.log("Tile Grid");
    this.tiles = [
      {
        title: "Title",
        image: this.firstImagePath,
        description: this.firstDescription
      },
      {
        title: "Title",
        image: this.secondImagePath,
        description: this.secondDescription
      },
      {
        title: "Title",
        image: this.thirdImagePath,
        description: this.thirdDescription
      },
      {
        title: "Title",
        image: this.fourthImagePath,
        description: this.fourthDescription
      },
      {
        title: "Title",
        image: this.fifthImagePath,
        description: this.fifthDescription
      },
      {
        title: "Title",
        image: this.sixthImagePath,
        description: this.sixthDescription
      }
    ];
  }
}
