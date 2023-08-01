import { LightningElement, api, track, wire } from 'lwc';
import getResourceRecords from '@salesforce/apex/addResourceController.getServiceResource';
import SaveAppointment from '@salesforce/apex/addResourceController.saveAppointment'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';



const columns = [
    { label: 'Name', fieldName: 'ResourceName' },
    { label: 'Distance (km)', fieldName: 'Distance', sortable: true, type : 'Decimal'},
    { label: 'Email', fieldName: 'Email' },
    { label: 'Employment Status', fieldName: 'EmploymentStatus' },
    { label: 'Resource Type', fieldName: 'ResourceType' },
];
export default class AddResourceLWC extends LightningElement {

    @api recordId;
    columns = columns;
    @track data;
    @track resourceid;
    viewRecords = true;
    viewResource = false;
    Loading = true;
    @track norecordsFound = '';
    @track selectedRecords = [];
    @track sortBy = 'Distance';
    @track sortDirection = 'asc';
    @track defaultSortDirection = 'asc';

    connectedCallback() {
        this.Loading = true;
        //alert(this.recordId);
    }

    doSorting(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortBy, this.sortDirection);
    }

    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.data));
        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };
        // cheking reverse direction
        let isReverse = direction === 'asc' ? 1: -1;
        // sorting data
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';
            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });
        this.data = parseData;
    }   

    @wire(getResourceRecords, { strAppointmentId: '$recordId' })
    getResource({ error, data }) {
        if (error) {
            this.Loading = false;
            // TODO: Error handling
        } else if (data) {
            // TODO: Data handling
            if (data.length > 0) {
                this.data = data;
                this.sortData('Distance', 'asc');
                //this.data.sort((a,b) => Date.parse(b.CreatedDate) - Date.parse(a.CreatedDate));
                this.viewResource = true;
            } else {
                this.viewResource = false;
                this.norecordsFound = 'No Resource Found';
            }
            this.Loading = false;
        }
    }

    handleclose() {
        this.Loading = true;
        this.viewRecords = false;
        window.history.back();
    }

    handleSave() {
        this.Loading = true;
        this.selectedRecords = this.template.querySelector("lightning-datatable").getSelectedRows();
        if (this.selectedRecords.length === 0) {
            const event = new ShowToastEvent({
                title: '',
                message: 'Please Select Resource',
                variant: 'warning',
                mode: 'dismissable'
            });
            this.dispatchEvent(event);
            this.Loading = false;
            return;
        }

        // this.resourceid = '';
        // if(this.selectedRecords.length === 1){
        //     this.selectedRecords.forEach(element => {
        //         this.resourceid = element.ResourceId;
        //     });
        // }
        // if(this.selectedRecords.length > 1){
        //     this.selectedRecords.forEach(element => {
        //         this.resourceid = element.ResourceId;
        //     });
        // }

        SaveAppointment({ strRecordId: this.recordId, strLstSerResource: this.selectedRecords })
            .then(result => {
                //window.location.href = '/'+this.recordId;
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: this.recordId,
                        objectApiName: 'ServiceAppointment',
                        actionName: 'view'
                    }
                });
                this.Loading = false;
            })
            .catch(error => {
                this.error = error;
                window.history.back();
                this.Loading = true;
        })
    }
}