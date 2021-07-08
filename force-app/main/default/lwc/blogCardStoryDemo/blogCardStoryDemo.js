import { LightningElement } from "lwc";
import getStories from "@salesforce/apex/blogCardStoryDemo.getStories";

export default class BlogCardStoryDemo extends LightningElement {
  cardList = [];

  //! On connection, get the Stories wrapped to show them in the grid
  connectedCallback() {
    getStories().then((result) => {
      console.log(result);
      this.cardList = result;
    });
  }
}
