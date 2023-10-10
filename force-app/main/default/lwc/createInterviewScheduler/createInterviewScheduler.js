import { LightningElement, wire, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import INTERVIEW_SCHEDULER_OBJECT from '@salesforce/schema/CEMS_Internal_Scheduler__c';
import INTERVIEW_PANEL_FIELD from '@salesforce/schema/CEMS_Internal_Scheduler__c.CEMS_Interview_Panel__c';
import INTERVIEW_STARTTIME_FIELD from '@salesforce/schema/CEMS_Internal_Scheduler__c.CEMS_Interview_Start_Time__c';
import INTERVIEW_ENDTIME_FIELD from '@salesforce/schema/CEMS_Internal_Scheduler__c.CEMS_Interview_End_Time__c';
import INTERVIEW_NAME_FIELD from '@salesforce/schema/CEMS_Internal_Scheduler__c.Name';
import INTERVIEW_LOCATION_FIELD from '@salesforce/schema/CEMS_Internal_Scheduler__c.CEMS_Interview_Location__c';
import INTERVIEW_ROUND_FIELD from '@salesforce/schema/CEMS_Internal_Scheduler__c.CEMS_Interview_Round__c';
import INTERVIEW_JOBAPPLICATION_FIELD from '@salesforce/schema/CEMS_Internal_Scheduler__c.CEMS_Job_Application_ID__c';
import INTERVIEW_MEETINGLINK_FIELD from '@salesforce/schema/CEMS_Internal_Scheduler__c.CEMS_Meeting_Link__c';
import INTERVIEW_INTERVIEWSTATUS_FIELD from '@salesforce/schema/CEMS_Internal_Scheduler__c.CEMS_Interview_Status__c';
import INTERVIEW_INTERVIEWTYPE_FIELD from '@salesforce/schema/CEMS_Internal_Scheduler__c.CEMS_Interview_Type__c';


export default class CreateInterviewScheduler extends LightningElement {
    @api recordId;
    @track showForm = false;
    objectApiName = INTERVIEW_SCHEDULER_OBJECT;
    fieldList = [INTERVIEW_NAME_FIELD, INTERVIEW_PANEL_FIELD, INTERVIEW_JOBAPPLICATION_FIELD, INTERVIEW_INTERVIEWSTATUS_FIELD, INTERVIEW_ROUND_FIELD, INTERVIEW_STARTTIME_FIELD, INTERVIEW_ENDTIME_FIELD,INTERVIEW_INTERVIEWTYPE_FIELD, INTERVIEW_MEETINGLINK_FIELD, INTERVIEW_LOCATION_FIELD];
    

    successHandler(event) {
        console.log(event.detail.id);
        const toastEvent = new ShowToastEvent({
            title: 'Interview scheduled successfully',
            message: 'Record ID: ' + event.detail.id,
            variant: 'success'
        });
        this.dispatchEvent(toastEvent);
    }
    
   
  
    handleScheduleInterview() {
        // Logic to handle the "Schedule Interview" button click
        // You can perform any necessary actions here
        
        // Dispatch a custom event to notify the parent component
        this.showForm = true;
        const event = new CustomEvent('scheduleinterview');
        this.dispatchEvent(event);
    }
   
    

    handleCloseSchedule() {
        this.showForm = false;
       // const event = new CustomEvent('openscheduleinterview');
        //this.dispatchEvent(event);
    }
    handleSubmit(event) {
        event.preventDefault(); // Prevent default form submission
        const fields = event.detail.fields;
        const isValid = this.validateFields(fields);
    
        if (isValid) {
            event.target.submit(); // Submit the form if fields are valid
        } else {
            const requiredFields = [
                { apiName: INTERVIEW_NAME_FIELD.fieldApiName, label: 'Name' },
                { apiName: INTERVIEW_PANEL_FIELD.fieldApiName, label: 'Panel' },
                { apiName: INTERVIEW_JOBAPPLICATION_FIELD.fieldApiName, label: 'Job Application' },
                { apiName: INTERVIEW_STARTTIME_FIELD.fieldApiName, label: 'Interview Start Time' },
                { apiName: INTERVIEW_ENDTIME_FIELD.fieldApiName, label: 'Interview End Time' }
            ];
    
            const missingFields = requiredFields
                .filter(field => !fields[field.apiName])
                .map(field => field.label);
    
            const errorMessage = 'Please fill ' + missingFields.join(', ') + ' are required.';
    
            const toastEvent = new ShowToastEvent({
                title: 'Error',
                message: errorMessage,
                variant: 'error',
                duration: '10000' // Set duration to 5 seconds (5000 milliseconds)
            });
            this.dispatchEvent(toastEvent);
        }
    }
    
    validateFields(fields) {
        // Check if required fields are filled
        const isNameFilled = !!fields[INTERVIEW_NAME_FIELD.fieldApiName];
        const isPanelFilled = !!fields[INTERVIEW_PANEL_FIELD.fieldApiName];
        const isJobApplicationFilled = !!fields[INTERVIEW_JOBAPPLICATION_FIELD.fieldApiName];
        const isStartTimeFilled = !!fields[INTERVIEW_STARTTIME_FIELD.fieldApiName];
        const isEndTimeFilled = !!fields[INTERVIEW_ENDTIME_FIELD.fieldApiName];
    
        // Create an array to hold the labels of missing fields
        const missingFields = [];
    
        if (!isNameFilled) {
            missingFields.push('Name');
        }
    
        if (!isPanelFilled) {
            missingFields.push('Panel');
        }
    
        if (!isJobApplicationFilled) {
            missingFields.push('Job Application');
        }
    
        if (!isStartTimeFilled) {
            missingFields.push('Interview Start Time');
        }
    
        if (!isEndTimeFilled) {
            missingFields.push('Interview End Time');
        }
    
        // Return true if all required fields are filled and additional validation passes
        return missingFields.length === 0;
    }
}
/*
import { LightningElement, wire, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import INTERVIEW_SCHEDULER_OBJECT from '@salesforce/schema/CEMS_Internal_Scheduler__c';
import INTERVIEW_PANEL_FIELD from '@salesforce/schema/CEMS_Internal_Scheduler__c.CEMS_Interview_Panel__c';
import INTERVIEW_STARTTIME_FIELD from '@salesforce/schema/CEMS_Internal_Scheduler__c.CEMS_Interview_Start_Time__c';
import INTERVIEW_ENDTIME_FIELD from '@salesforce/schema/CEMS_Internal_Scheduler__c.CEMS_Interview_End_Time__c';
import INTERVIEW_NAME_FIELD from '@salesforce/schema/CEMS_Internal_Scheduler__c.Name';
import INTERVIEW_LOCATION_FIELD from '@salesforce/schema/CEMS_Internal_Scheduler__c.CEMS_Interview_Location__c';
import INTERVIEW_ROUND_FIELD from '@salesforce/schema/CEMS_Internal_Scheduler__c.CEMS_Interview_Round__c';
import INTERVIEW_JOBAPPLICATION_FIELD from '@salesforce/schema/CEMS_Internal_Scheduler__c.CEMS_Job_Application_ID__c';
import INTERVIEW_MEETINGLINK_FIELD from '@salesforce/schema/CEMS_Internal_Scheduler__c.CEMS_Meeting_Link__c';
import INTERVIEW_INTERVIEWSTATUS_FIELD from '@salesforce/schema/CEMS_Internal_Scheduler__c.CEMS_Interview_Status__c';
import INTERVIEW_INTERVIEWTYPE_FIELD from '@salesforce/schema/CEMS_Internal_Scheduler__c.CEMS_Interview_Type__c';

export default class CreateInterviewScheduler extends LightningElement {
    @api recordId;
    @track showForm = false;
    objectApiName = INTERVIEW_SCHEDULER_OBJECT;
    fieldList = [
        INTERVIEW_NAME_FIELD,
        INTERVIEW_PANEL_FIELD,
        INTERVIEW_JOBAPPLICATION_FIELD,
        INTERVIEW_INTERVIEWSTATUS_FIELD,
        INTERVIEW_ROUND_FIELD,
        INTERVIEW_STARTTIME_FIELD,
        INTERVIEW_ENDTIME_FIELD,
        INTERVIEW_INTERVIEWTYPE_FIELD,
        ...(this.isVirtualInterview ? [INTERVIEW_MEETINGLINK_FIELD] : [INTERVIEW_LOCATION_FIELD])
    ];

    get isVirtualInterview() {
        const interviewType = this.template.querySelector('[data-field="' + INTERVIEW_INTERVIEWTYPE_FIELD.fieldApiName + '"]').value;
        return interviewType === 'Virtual Interview';
    }

    successHandler(event) {
        console.log(event.detail.id);
        const toastEvent = new ShowToastEvent({
            title: 'Interview scheduled',
            message: 'Record ID: ' + event.detail.id,
            variant: 'success'
        });
        this.dispatchEvent(toastEvent);
    }

    handleScheduleInterview() {
        this.showForm = true;
    }

    handleCloseSchedule() {
        this.showForm = false;
    }

    handleSubmit(event) {
        // Prevent the default form submission
        event.preventDefault();

        // Check if all mandatory fields are filled
        const mandatoryFieldsFilled = this.fieldList.every((field) => {
            const fieldValue = event.detail.fields[field.fieldApiName];
            return fieldValue && fieldValue.trim() !== '';
        });

        // If mandatory fields are not filled, display an error toast
        if (!mandatoryFieldsFilled) {
            const errorToastEvent = new ShowToastEvent({
                title: 'Error',
                message: 'Please fill in all mandatory fields',
                variant: 'error'
            });
            this.dispatchEvent(errorToastEvent);
        } else {
            // Dispatch the form submit event to save the record
            const submitEvent = new CustomEvent('submit');
            this.dispatchEvent(submitEvent);
        }
    }
}*/