import { LightningElement, wire } from 'lwc';
//import getInterviewData from '@salesforce/apex/CEMSSchedulerController.getInterviewData';
//import { getPicklistValues } from 'lightning/uiObjectInfoApi';
//import { getObjectInfo } from 'lightning/uiObjectInfoApi';
//import Round_Field from '@salesforce/schema/CEMS_Internal_Scheduler__c.CEMS_Interview_Round__c'


export default class CEMSSchedulerTable extends LightningElement {
    /*selectedRound = '';
    picklistValues; // Add roundOptions property

    interviewData;
    columns = [
       
        { label: 'Date', fieldName: 'CEMS_Interview_Start_Time__c' },
        { label: 'Applicant', fieldName: 'Name' },
        { label: 'Status', fieldName: 'CEMS_Interview_Status__c' },
        { label: 'Panel', fieldName: 'CEMS_Interview_Panel__r.Name' },
        { label: 'Date', fieldName: 'CEMS_Interview_Round__c' },
        
    ];

    @wire(getPicklistValues, { recordTypeId: '012DO0000008XetYAE', fieldApiName: Round_Field})
    loadPicklistValues({ data, error }) {
        if (data) {
            this.picklistValues = data.values;
            console.log(this.picklistValues);
        } else if (error) {
            // Handle error if necessary
            console.error('Error loading picklist values:', error);
        }
    }

    @wire(getInterviewData)
    wiredInterviewData({ error, data }) {
        if (data) {
            
            this.interviewData =  data.map(
                record => Object.assign(
                  { "CEMS_Interview_Panel__r.Name": record.CEMS_Interview_Panel__r.Name},
                  record
                  )
                  );
                  console.log(JSON.stringify(this.interviewData));
        
        } else if (error) {
            // Handle error if needed
        }
    }




    
    
    handleRoundChange(event) {
        this.selectedRound = event.detail.value;
        this.filterDataByRound();
    }

    filterDataByRound() {
        
    }
    
    */
}