import { LightningElement, api, track } from "lwc";

export default class EsDualListBox extends LightningElement {
  @api label = "DualList Label";
  @api availableColumnLabel = "Available Column Label";
  @api selectedColumnLabel = "Selected Column Label";
  @api elements = [
    {
      Label: "English",
      Value: "123-English",
      IconName: "utility:user",
      Tooltip: "Your Tooltip",
      Disabled: false,
      Selected: false
    },
    {
      Label: "Italian",
      Value: "123-Italian",
      IconName: null,
      Tooltip: null,
      Disabled: false,
      Selected: true
    },
    {
      Label: "French",
      Value: "123-French",
      IconName: null,
      Tooltip: null,
      Disabled: true,
      Selected: false
    },
    {
      Label: "German",
      Value: "123-German",
      IconName: "utility:announcement",
      Tooltip: null,
      Disabled: false,
      Selected: false
    },
    {
      Label: "Korean",
      Value: "123-Korean",
      IconName: null,
      Tooltip: "Help text",
      Disabled: true,
      Selected: false
    },
    {
      Label: "Spanish",
      Value: "123-Spanish",
      IconName: null,
      Tooltip: null,
      Disabled: false,
      Selected: true
    }
  ];

  @track selected;
  @track available;

  connectedCallback() {
    console.log("Elements", JSON.parse(JSON.stringify(this.elements)));
    this.available = this.elements
      .filter((element) => !element.Selected)
      .map((element) =>
        !element.Disabled
          ? { ...element, Tooltip: element.Name }
          : { ...element }
      );
    this.selected = this.elements
      .filter((element) => element.Selected)
      .map((element) =>
        !element.Disabled
          ? { ...element, Tooltip: element.Name }
          : { ...element }
      );
  }
}
