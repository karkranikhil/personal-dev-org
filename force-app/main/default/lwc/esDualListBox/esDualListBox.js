import { LightningElement, api, track } from "lwc";

const REQUIRED_ERROR_MESSAGE = "You must select at least one value.";
const MIN_ERROR_MESSAGE = "You must select a minimum of * values.";
const MAX_ERROR_MESSAGE = "You must select a maximum of * values.";
export default class EsDualListBox extends LightningElement {
  @api label = "DualList Label";
  @api availableColumnLabel = "Available Column Label";
  @api selectedColumnLabel = "Selected Column Label";
  @api disabledColor = "white";
  @api disabledBackground = "#9f9f9";
  @api iconVariant = "default";
  @api errorMessage = REQUIRED_ERROR_MESSAGE;
  @api minErrorMessage = MIN_ERROR_MESSAGE;
  @api maxErrorMessage = MAX_ERROR_MESSAGE;
  @api required = false;
  @api min;
  @api max;
  @api size = null;

  @api availableElements = [
    {
      Label: "English",
      Value: "123-English",
      IconName: "",
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
      Tooltip: "Banned",
      Disabled: true
    },
    {
      Label: "German",
      Value: "123-German",
      IconName: "",
      Tooltip: null,
      Disabled: false
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

  @api get returnedElements() {
    return this.selected.map((element) => ({
      Label: element.Label,
      Value: element.Value,
      IconName: element.IconName,
      Tooltip: element.Tooltip,
      Disabled: element.Disabled
    }));
  }

  connectedCallback() {
    console.log(
      "Available Elements",
      JSON.parse(JSON.stringify(this.availableElements))
    );
    console.log(
      "Selected Elements",
      JSON.parse(JSON.stringify(this.selectedElements))
    );
    this.available = this.availableElements
      .map((element) =>
        !element.Disabled
          ? { ...element, Tooltip: element.Label, Selected: false }
          : { ...element, Selected: false }
      )
      .sort((element) => {
        return element.Disabled ? 1 : -1; // `false` values first
      });
    this.selected = this.selectedElements
      .map((element) =>
        !element.Disabled
          ? { ...element, Tooltip: element.Label, Selected: false }
          : { ...element, Selected: false }
      )
      .sort((element) => {
        return element.Disabled ? 1 : -1; // `false` values first
      });
  }

  renderedCallback() {
    if (!this.hasRendered) {
      this.template.querySelectorAll(".icon").forEach((icon) => {
        icon.variant = this.iconVariant;
      });
      this.template.querySelectorAll(".disabled").forEach((disabled) => {
        disabled.style.backgroundColor = this.disabledBackground;
        disabled.style.color = this.disabledColor;
      });
      if (this.size) {
        this.template
          .querySelectorAll(".slds-dueling-list__options")
          .forEach((box) => {
            box.style.height = (this.size * 40).toString() + "px";
          });
      }
      this.hasRendered = true;
    }
  }

  handleSelect(event) {
    event.stopPropagation();
    let value = event.target.getAttribute("name");
    console.log("Value", value);
    this.available = this.available.map((element) =>
      element.Value === value
        ? { ...element, Selected: !element.Selected }
        : { ...element, Selected: false }
    );
    this.selected = this.selected.map((element) =>
      element.Value === value
        ? { ...element, Selected: !element.Selected }
        : { ...element, Selected: false }
    );
  }

  handleMoveRight() {
    console.log("Right");
    let selectedElement = this.available.find((element) => element.Selected);
    if (selectedElement) {
      this.selected.push(selectedElement);
      this.selected.sort((element) => {
        return element.Disabled ? 1 : -1; // `false` values first
      });
    }
    this.available = this.available
      .filter((element) => !element.Selected)
      .sort((element) => {
        return element.Disabled ? 1 : -1; // `false` values first
      });
  }
  handleMoveLeft() {
    console.log("Left");
    let selectedElement = this.selected.find((element) => element.Selected);
    if (selectedElement) {
      this.available.push(selectedElement);
      this.available.sort((element) => {
        return element.Disabled ? 1 : -1; // `false` values first
      });
    }
    this.selected = this.selected
      .filter((element) => !element.Selected)
      .sort((element) => {
        return element.Disabled ? 1 : -1; // `false` values first
      });
  }
  @api
  validate() {
    if (this.required && this.selected.length === 0) {
      return {
        isValid: false,
        errorMessage: this.errorMessage
      };
    }
    if (!this.required && this.selected.length === 0) {
      return {
        isValid: true
      };
    }
    if (this.min && this.selected.length < this.min) {
      return {
        isValid: false,
        errorMessage: this.minErrorMessage.replace("*", this.min)
      };
    }
    if (this.max && this.selected.length > this.max) {
      return {
        isValid: false,
        errorMessage: this.maxErrorMessage.replace("*", this.max)
      };
    }
    return {
      isValid: true
    };
  }
}
