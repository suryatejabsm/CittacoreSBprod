import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CEMS_Internal_Scheduler_OBJECT from '@salesforce/schema/CEMS_Internal_Scheduler__c';
import INTERVIEW_PANEL_NAME from '@salesforce/schema/CEMS_Internal_Scheduler__c.CEMS_Interview_Panel__c';
import INTERVIEW_I_FIELD from '@salesforce/schema/CEMS_Internal_Scheduler__c.CEMS_Interview_Panel__r.CEMS_Interviewer_1__c';
import INTERVIEW_II_FIELD from '@salesforce/schema/CEMS_Internal_Scheduler__c.CEMS_Interview_Panel__r.CEMS_Interviewer_2__c';
import INTERVIEW_III_FIELD from '@salesforce/schema/CEMS_Internal_Scheduler__c.CEMS_Interview_Panel__r.CEMS_Interviewer_3__c';

export default class EditInterviewPanel extends LightningElement {
    objectName = CEMS_Internal_Scheduler_OBJECT
    @api recordId;
    fields={ 
        interviewPanelField:  INTERVIEW_PANEL_NAME,
        interviwer1Field:INTERVIEW_I_FIELD,
        interview2Field:INTERVIEW_II_FIELD,
        interviewer3Field:INTERVIEW_III_FIELD
       

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

    handleSuccess() {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Interview saved successfully',
                variant: 'success',
            })
        );
        this.showTemplate = false;
    }
}