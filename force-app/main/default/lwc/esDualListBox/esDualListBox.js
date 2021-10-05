import { LightningElement, api, track } from "lwc";

export default class EsDualListBox extends LightningElement {
  @api label = "DualList Label";
  @api availableColumnLabel = "Available Column Label";
  @api selectedColumnLabel = "Selected Column Label";
  @api required = false;
  @api availableElements = [
    {
      Label: "English",
      Value: "123-English",
      IconName: "utility:clear",
      Tooltip: "Your Tooltip",
      Disabled: true
    },
    {
      Label: "Italian",
      Value: "123-Italian",
      IconName: null,
      Tooltip: null,
      Disabled: false
    },
    {
      Label: "French",
      Value: "123-French",
      IconName: "utility:ban",
      Tooltip: null,
      Disabled: true
    },
    {
      Label: "German",
      Value: "123-German",
      IconName: "",
      Tooltip: null,
      Disabled: true
    }
  ];
  @api selectedElements = [
    {
      Label: "Korean",
      Value: "123-Korean",
      IconName: null,
      Tooltip: "Help text",
      Disabled: true
    },
    {
      Label: "Spanish",
      Value: "123-Spanish",
      IconName: null,
      Tooltip: null,
      Disabled: false
    }
  ];

  @track selected;
  @track available;

  connectedCallback() {
    console.log(
      "Available Elements",
      JSON.parse(JSON.stringify(this.availableElements))
    );
    console.log(
      "Selected Elements",
      JSON.parse(JSON.stringify(this.selectedElements))
    );
    this.available = this.availableElements.map((element) =>
      !element.Disabled
        ? { ...element, Tooltip: element.Name, Selected: false }
        : { ...element, Selected: false }
    );
    this.selected = this.selectedElements.map((element) =>
      !element.Disabled
        ? { ...element, Tooltip: element.Name, Selected: false }
        : { ...element, Selected: false }
    );
  }

  handleSelect(event) {
    event.stopPropagation();
    let value = event.target.getAttribute("name");
    console.log("Value", value);
    this.available = this.available.map((element) =>
      element.Value === value
        ? { ...element, Selected: true }
        : { ...element, Selected: false }
    );
    this.selected = this.selected.map((element) =>
      element.Value === value
        ? { ...element, Selected: true }
        : { ...element, Selected: false }
    );
    let selected = this.available.find((element) => element.Value === value);
    selected =
      selected !== undefined
        ? selected
        : this.selected.find((element) => element.Value === value);

    console.log("Selected", JSON.parse(JSON.stringify(selected)));
  }
}
