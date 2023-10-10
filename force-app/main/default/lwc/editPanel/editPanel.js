import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import INTERVIEW_PANEL_OBJECT from '@salesforce/schema/CEMS_Interview_Panel__c';
import NAME_FIELD from '@salesforce/schema/CEMS_Interview_Panel__c.Name';
import INTERVIEWER1_FIELD from '@salesforce/schema/CEMS_Interview_Panel__c.CEMS_Interviewer_1__c';
import INTERVIEWER2_FIELD from '@salesforce/schema/CEMS_Interview_Panel__c.CEMS_Interviewer_2__c';
import INTERVIEWER3_FIELD from '@salesforce/schema/CEMS_Interview_Panel__c.CEMS_Interviewer_3__c';
import POSITION_FIELD from '@salesforce/schema/CEMS_Interview_Panel__c.CEMS_Position_Name__c';


export default class EditPanel extends LightningElement {

    objectName = INTERVIEW_PANEL_OBJECT
    @api recordId;
    fields={ 
        
        nameField:NAME_FIELD,
        positionField:POSITION_FIELD,
        interviewer1Field:INTERVIEWER1_FIELD,
        interviewer2Field:INTERVIEWER2_FIELD,
        interviewer3Field:INTERVIEWER3_FIELD
        
    
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

   
    
    handleClose() {
        const closeEvent = new CustomEvent('closepanel');
        this.dispatchEvent(closeEvent);
    }

    

    handleSuccess() {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Interview panel successfully updated',
                variant: 'success'
            })
        );
        this.showTemplate = false;
    }
}