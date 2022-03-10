import { LightningElement } from "lwc";
import IMAGE_URL from "@salesforce/resourceUrl/ImageButtonCar";

export default class EsImageButtonDemo extends LightningElement {
  imageUrl = IMAGE_URL;

  buttons = [
    {
      id: "Button 1",
      label: "I am a button",
      image: this.imageUrl,
      theme: "dark",
      size: "small",
      variant: "overlay"
    },
    {
      id: "Button 2",
      label: "Click",
      image: "https://picsum.photos/600?random=3",
      theme: "light",
      size: "small",
      variant: "contained",
      lightColor: "lightcyan",
      darkColor: "darkgoldenrod"
    },
    {
      id: "Button 3",
      label: "Random Label",
      image: "https://picsum.photos/600?random=4",
      theme: "light",
      size: "small",
      variant: "overlay",
      lightColor: "lightsteelblue"
    },
    {
      id: "Button 4",
      label: "Hey!",
      image: this.imageUrl,
      theme: "dark",
      size: "small",
      variant: "contained",
      darkColor: "darkblue"
    }
  ];

  handleSelect(event) {
    // eslint-disable-next-line no-alert
    alert(JSON.stringify(event.detail, null, 4));
  }
}
