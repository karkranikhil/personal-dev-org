import { LightningElement } from "lwc";
import IMAGE_URL from "@salesforce/resourceUrl/ImageButtonCar";

export default class EsImageButtonDemo extends LightningElement {
  imageUrl = IMAGE_URL;

  buttons = [
    {
      id: "Button1",
      label: "I am a button",
      image: this.imageUrl,
      theme: "dark",
      size: "small",
      variant: "overlay"
    },
    {
      id: "Button2",
      label: "Click",
      image: "https://picsum.photos/600?random=3",
      theme: "light",
      size: "small",
      variant: "contained",
      lightColor: "lightcyan",
      darkColor: "darkgoldenrod"
    },
    {
      id: "Button3",
      label: "Random Label",
      image: "https://picsum.photos/600?random=4",
      theme: "light",
      size: "small",
      variant: "overlay",
      lightColor: "lightsteelblue"
    },
    {
      id: "Button4",
      label: "Hey!",
      image: this.imageUrl,
      theme: "dark",
      size: "small",
      variant: "contained",
      darkColor: "darkblue"
    },
    {
      id: "Button5",
      label: "Stretch",
      image: this.imageUrl,
      theme: "dark",
      size: "small-stretch",
      variant: "overlay"
    },
    {
      id: "Button7",
      label: "Stretch",
      image: "https://picsum.photos/600?random=7",
      theme: "light",
      size: "small-stretch",
      variant: "overlay"
    },
    {
      id: "Button8",
      label: "Stretch",
      image: "https://picsum.photos/600?random=8",
      theme: "light",
      size: "small-stretch",
      variant: "overlay"
    }
  ];

  handleSelect(event) {
    // eslint-disable-next-line no-alert
    alert(JSON.stringify(event.detail, null, 4));
  }
}
