import { LightningElement } from "lwc";
import IMAGE_URL from "@salesforce/resourceUrl/ImageButtonCar";

export default class EsImageButtonDemo extends LightningElement {
  imageUrl = IMAGE_URL;

  buttons = [
    {
      label: "I am a button",
      image: this.imageUrl,
      theme: "dark",
      size: "small",
      variant: "overlay"
    },
    {
      label: "Hello there",
      image: "https://picsum.photos/600?random=3",
      theme: "light",
      size: "small",
      variant: "contained",
      lightColor: "lightblue"
    }
  ];
}
