import { LightningElement } from "lwc";
export default class InfoCardList extends LightningElement {
  cards = [
    {
      Id: 1,
      label: "Jon Snow",
      date: new Date(),
      iconName: "utility:bug"
    },
    {
      Id: 2,
      label: "Rob Stark",
      date: new Date(),
      iconName: "utility:user"
    },
    {
      Id: 3,
      label: "Tywin Lannister",
      date: new Date(),
      iconName: "utility:bug"
    },
    {
      Id: 4,
      label: "Aegon",
      date: new Date(),
      iconName: "utility:user"
    },
    {
      Id: 5,
      label: "Dany Targaryen",
      date: new Date(),
      iconName: "utility:bug"
    },
    {
      Id: 6,
      label: "Jaime Lannister",
      date: new Date(),
      iconName: "utility:user"
    },
    {
      Id: 7,
      label: "Ned Stark",
      date: new Date(),
      iconName: "utility:user"
    }
  ];
}
