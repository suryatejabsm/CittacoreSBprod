import { LightningElement, wire, api, track } from 'lwc';
import getjobApplications from '@salesforce/apex/RegistrationForm.getjobApplications';
// import { getRecord } from 'lightning/uiRecordApi';

export default class CemsJobAppView extends LightningElement {
  @track jobApplications;
  @track modalContainer = false;
  @track recordid;
  @api displayModelRow = {};
  @track isEditing = false;
  @api selectedJobApplicationId;


  @wire(getjobApplications)
  wiredJobApplications({ error, data }) {
    if (data) {
      console.log(this.recordId);
      this.jobApplications = data.map((record) => {
        const jobOpeningName = record.CEMS_Job_Opening__r ? record.CEMS_Job_Opening__r.Name : '';
        return { ...record, jobOpeningName };
      });
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.jobApplications = [];
    }
  }

  get columns() {
    return [

      //  {
      //   label: 'Job application Id',
      //   fieldName: 'Name',
      //   type: 'text',
      //   cellAttributes: { iconName: 'standard:user', iconPosition: 'left' },
      //   typeAttributes: {
      //     label: { fieldName: 'CEMS_First_Name__c' },
      //     title: { fieldName: 'CEMS_Last_Name__c' }
      //   }
      // }, 
      { label: 'Name', fieldName: 'CEMS_Last_Name__c' },
      { label: 'Email', fieldName: 'CEMS_Email__c' },
      {
        label: 'Job Opening',
        fieldName: 'jobOpeningName',

        cellAttributes: { iconName: 'standard:job_position' }
      },

      { label: 'Skills', fieldName: 'CEMS_Skills__c' },
      { label: 'Stage', fieldName: 'CEMS_Stage__c' },
      { label: 'Status', fieldName: 'CEMS_Status__c' },
      // {label:'RefferedBy',fieldName:'CEMS_Referral__c'} // Add more columns as needed
    ];
  }


  closeModalAction() {
    this.modalContainer = false;
  }

}