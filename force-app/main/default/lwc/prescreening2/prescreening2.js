import { LightningElement, wire, track, api } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { getRecord, getFieldValue, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CEMS_JOB_APPLICATION_OBJECT from '@salesforce/schema/CEMS_Job_Application__c';
import NAME_FIELD from '@salesforce/schema/CEMS_Job_Application__c.CEMS_First_Name__c';
import POSITION_FIELD from '@salesforce/schema/CEMS_Job_Application__c.Offered_Position__c';
import CEMS_EMAIL_FIELD from '@salesforce/schema/CEMS_Job_Application__c.CEMS_Email__c';
import EMAIL_NOTIFICATION_FIELD from '@salesforce/schema/CEMS_Job_Application__c.CEMS_Email_Notification__c';
import JOB_APPLICATION_FIELD from '@salesforce/schema/CEMS_Job_Application__c.Name';

export default class Prescreening2 extends LightningElement {
    @track nameField;
    @track positionField;
    @track jobApplication;
    @track cemsEmailField;
    @track emailNotificationField;
    @track inputValue;
    @api recordId;

    @wire(getRecord, {
        recordId: '$recordId',
        fields: [NAME_FIELD, POSITION_FIELD, CEMS_EMAIL_FIELD, JOB_APPLICATION_FIELD, EMAIL_NOTIFICATION_FIELD]
    })
    wiredRecord({ error, data }) {
        if (data) {
            this.nameField = getFieldValue(data, NAME_FIELD);
            this.positionField = getFieldValue(data, POSITION_FIELD);
            this.cemsEmailField = getFieldValue(data, CEMS_EMAIL_FIELD);
            this.jobApplication = getFieldValue(data, JOB_APPLICATION_FIELD);
            this.emailNotificationField = getFieldValue(data, EMAIL_NOTIFICATION_FIELD);
            this.inputValue = this.emailNotificationField;
        } else if (error) {
            console.error('Error retrieving record', error);
        }
    }

    handleUpdate() {
       
    }

    handleSubmit(event) {
        event.preventDefault();
        this.inputValue = 'Send';
        

        const fields = {};
        fields[EMAIL_NOTIFICATION_FIELD.fieldApiName] = this.inputValue;

        const recordInput = {
            fields: fields,
            recordId: this.recordId
        };

        updateRecord(recordInput)
            .then(() => {
                this.showToast('Success', 'Pre Screening Notification has been Send', 'success');
                this.emailNotificationField = 'Notification Sent';

                refreshApex(this.wiredRecord);
            })
            .catch((error) => {
                console.error('Error updating record', error);
                this.showToast('Error', 'Error updating record', 'error');
            });
    }

    

    showToast(title, message, variant) {
        const toastEvent = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });

        this.dispatchEvent(toastEvent);
    }
}