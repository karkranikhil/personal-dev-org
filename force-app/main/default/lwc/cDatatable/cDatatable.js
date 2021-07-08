import LightningDatatable from 'lightning/datatable';
import DatatableLookupTemplate from "./lookuptemplate.html";

export default class CDatatable extends LightningDatatable {
    static customTypes = {
        lookup: {
            template: DatatableLookupTemplate,
            standardCellLayout: true,
            typeAttributes: ['label', 'value', 'placeholder', 'fieldName', 'object', 'context', 'variant', 'name', 'fields', 'target']
        }
    };
}