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


export default class EditInterviewSchedule extends LightningElement {
    objectName = INTERVIEW_SCHEDULER_OBJECT
    @api recordId;
    fields={ 
        
        nameField:INTERVIEW_NAME_FIELD,
        panelField:INTERVIEW_PANEL_FIELD,
        jobAppField:INTERVIEW_JOBAPPLICATION_FIELD,
        typeField:INTERVIEW_INTERVIEWTYPE_FIELD,
        linkField:INTERVIEW_MEETINGLINK_FIELD,
        locationField:INTERVIEW_LOCATION_FIELD,
        startTimeField:INTERVIEW_STARTTIME_FIELD,
        endTimeField:INTERVIEW_ENDTIME_FIELD,
        roundField:INTERVIEW_ROUND_FIELD,
        statusField:INTERVIEW_INTERVIEWSTATUS_FIELD,

    }
    handleReset(){ 
        const inputFields = this.template.querySelectorAll('lightning-input-field')
        if(inputFields){ 
            Array.from(inputFields).forEach(field=>{ 
                field.reset()
            })
        }
    }
    @track showTemplate = false;

    handleClick() {
        this.showTemplate = true;
    }
    handleClose() {
        this.showTemplate = false;
    }

    @api
    handleSuccess() {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Interview saved successfully',
                variant: 'success',
            })
        );
        console.log('Interview saved successfully');
        // Dispatch the custom event here
       // Dispatch the custom event here
    // Dispatch the custom event here
    const saveSuccessEvent = new CustomEvent('interviewsaved');
    this.dispatchEvent(saveSuccessEvent);
    this.showTemplate = false;
    }
}