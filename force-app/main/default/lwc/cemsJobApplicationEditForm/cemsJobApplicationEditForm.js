import { LightningElement, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import ApexController from '@salesforce/apex/AccViewContlr.createJobApplication';
import JOB_APPLICATION_OBJECT from '@salesforce/schema/CEMS_Job_Application__c';

export default class CEMSJobApplicationEditForm extends LightningElement {
    @wire(getObjectInfo, { objectApiName: JOB_APPLICATION_OBJECT })
    objectInfo;

    get jobApplicationRecordTypeId() {
        return this.objectInfo.data.defaultRecordTypeId;
    }

    handleSubmit(event) {
        event.preventDefault();
        const fields = event.detail.fields;

        // Submit the form data to the Apex controller
        ApexController.createJobApplication(fields)
            .then(result => {
                // Handle the successful creation of the record
                console.log('Record created: ', result);
                // You can show a success message or navigate to a different page if needed.
            })
            .catch(error => {
                // Handle any errors that occurred during the record creation
                console.error('Error creating record: ', error);
                // You can show an error message to the user or perform other error-handling actions.
            });
    }
}