import { LightningElement, wire, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import INTERVIEW_PANEL_OBJECT from '@salesforce/schema/CEMS_Interview_Panel__c';

import INTERVIEWER1 from '@salesforce/schema/CEMS_Interview_Panel__c.CEMS_Interviewer_1__c';
import INTERVIEWER2 from '@salesforce/schema/CEMS_Interview_Panel__c.CEMS_Interviewer_1__c';
import INTERVIEWER3 from '@salesforce/schema/CEMS_Interview_Panel__c.CEMS_Interviewer_1__c';
import POSITION from '@salesforce/schema/CEMS_Interview_Panel__c.CEMS_Position_Name__c';


import PANEL_NAME_FIELD from '@salesforce/schema/CEMS_Interview_Panel__c.Name';



export default class CreateInterviewPanel extends LightningElement {
    @api recordId;
    @track showForm = false;
    objectApiName = INTERVIEW_PANEL_OBJECT;
    fieldList = [PANEL_NAME_FIELD, POSITION, INTERVIEWER1, INTERVIEWER2, INTERVIEWER3];
    handleClick() {
        this.showForm = true;
    }

    handleCancel() {
        this.showForm = false;
    }

 /*
    handleSubmit(event) {
        event.preventDefault(); // Prevent the default form submission behavior
    
        // Check if at least one interviewer field is filled
        const interviewersFilled = this.fieldList.some(field => {
            const fieldValue = this.template.querySelector(`lightning-input-field[data-field-api-name="${field.fieldApiName}"]`);
            return fieldValue && fieldValue.value;
        });
    
        if (!interviewersFilled) {
            // Display an error toast message if no interviewer is filled
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Please select at least one interviewer',
                    variant: 'error',
                })
            );
        } else {
            // Allow the form submission to proceed
            this.template.querySelector('lightning-record-form').submit();
        }
    }*/
    
    handleSuccess(event) {
        this.showForm = false;
    
        // Get the record ID of the newly created Interview Panel
        const newRecordId = event.detail.id;
        console.log('Panel Id: ' + newRecordId);
    
        // Show a success toast message
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Interview Panel created successfully',
                variant: 'success',
            })
        );
    
        // Perform any additional actions after a successful form submission
        // For example, navigate to the newly created record page
        // this.navigateToRecord(newRecordId);
    }
  
   
}