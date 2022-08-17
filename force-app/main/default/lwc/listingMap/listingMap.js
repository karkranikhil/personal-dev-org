import { LightningElement, api } from "lwc";

const LIST_VIEW_VISIBLE = "visible";
const LIST_VIEW_HIDDEN = "hidden";
const DEFAULT_ZOOM = 15;

export default class ListingMap extends LightningElement {
  @api recordId;
  selectedMarkerValue = "SF1";
  zoomLevel = DEFAULT_ZOOM;
  listViewValue = LIST_VIEW_VISIBLE;
  center = {
    location: { Street: "1000 5th Ave", City: "New York", State: "NY" }
  };
  mapOptions = {
    disableDefaultUI: true
  };
  mapMarkers = [
    {
      location: {
        Street: "1000 5th Ave",
        City: "New York",
        State: "NY"
      },
      value: "SF1",
      title: "Metropolitan Museum of Art",
      description:
        "A grand setting for one of the greatest collections of art, from ancient to contemporary."
    },
    {
      location: {
        Street: "11 W 53rd St",
        City: "New York",
        State: "NY"
      },
      value: "SF2",

      title: "Museum of Modern Art (MoMA)",
      description: "Thought-provoking modern and contemporary art."
    },
    {
      location: {
        Street: "1071 5th Ave",
        City: "New York",
        State: "NY"
      },
      value: "SF3",
      title: "Guggenheim Museum",
      description: "World-renowned collection of modern and contemporary art."
    }
  ];

  connectedCallback() {
    console.log("Map Loaded", this.recordId);
  }

  get isListHidden() {
    return this.listViewValue === LIST_VIEW_HIDDEN;
  }

  handleMarkerSelect(event) {
    this.selectedMarkerValue = event.target.selectedMarkerValue;
  }

  toggleListView() {
    this.listViewValue =
      this.listViewValue === LIST_VIEW_HIDDEN
        ? LIST_VIEW_VISIBLE
        : LIST_VIEW_HIDDEN;
  }
}
