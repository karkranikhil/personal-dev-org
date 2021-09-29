import { LightningElement , api} from 'lwc';

export default class InfoCard extends LightningElement {
    @api label;
    @api iconName;
    @api date;
}