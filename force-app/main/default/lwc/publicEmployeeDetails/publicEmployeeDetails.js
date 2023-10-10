import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

const FIELDS = ['CEMS_Personnel__c.Name', 'CEMS_Personnel__c.CEMS_Employee_ID__c', 'CEMS_Personnel__c.CEMS_Work_Email__c'];

export default class PublicEmployeeDetails extends LightningElement {
    @api recordId;
    employee;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    loadEmployee({ error, data }) {
        if (data) {
            this.employee = data;
        } else if (error) {
            console.error('Error retrieving employee details:', error);
        }
    }
}