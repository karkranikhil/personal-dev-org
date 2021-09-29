import { LightningElement } from 'lwc';

export default class InfoCardList extends LightningElement {
    cards = [{
        Id: 123,
        label:'Jon Snow',
        date: new Date(),
        iconName: 'utility:bug'
    },{
        Id:456,
        label:'Rob Stark',
        date: new Date(),
        iconName: 'utility:user'
    }
]
}