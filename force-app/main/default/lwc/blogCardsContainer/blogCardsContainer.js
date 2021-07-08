import { LightningElement } from "lwc";

export default class BlogCardsContainer extends LightningElement {
  cardList = [
    {
      Id: 1,
      cardIcon: "utility:case",
      sections: [
        {
          sectionTitle: "First Section Title",
          sectionLink: {
            label: "First Link Label",
            url: "https://www.google.com"
          }
        },
        {
          sectionTitle: "Second Section Title",
          sectionLink: {
            label: "Second Link Label",
            url: "https://www.google.com"
          }
        },
        {
          sectionTitle: "Third Section Title",
          sectionLink: {
            label: "Third Link Label",
            url: "https://www.google.com"
          }
        }
      ]
    },

    {
      Id: 2,
      cardIcon: "utility:comments",

      sections: [
        {
          sectionTitle: "First Section Title",
          sectionLink: {
            label: "First Link Label",
            url: "https://www.google.com"
          }
        },
        {
          sectionTitle: "Second Section Title",
          sectionLink: {
            label: "Second Link Label",
            url: "https://www.google.com"
          }
        }
      ],
      color: "red"
    },
    {
      Id: 3,
      cardIcon: "utility:bucket",

      sections: [
        {
          sectionTitle: "First Section Title",
          sectionLink: {
            label: "First Link Label",
            url: "https://www.google.com"
          }
        },
        {
          sectionTitle: "Second Section Title",
          sectionLink: {
            label: "Second Link Label",
            url: "https://www.google.com"
          }
        },
        {
          sectionTitle: "Third Section Title",
          sectionLink: {
            label: "Third Link Label",
            url: "https://www.google.com"
          }
        },
        {
          sectionTitle: "Forth Section Title",
          sectionLink: {
            label: "Forth Link Label",
            url: "https://www.google.com"
          }
        }
      ],
      color: "orange"
    },
    {
      Id: 4,
      cardIcon: "utility:activity",

      sections: [
        {
          sectionTitle: "First Section Title",
          sectionLink: {
            label: "First Link Label",
            url: "https://www.google.com"
          }
        },
        {
          sectionTitle: "Second Section Title",
          sectionLink: {
            label: "Second Link Label",
            url: "https://www.google.com"
          }
        },
        {
          sectionTitle: "Third Section Title",
          sectionLink: {
            label: "Third Link Label",
            url: "https://www.google.com"
          }
        }
      ],
      color: "black"
    }
  ];
}
