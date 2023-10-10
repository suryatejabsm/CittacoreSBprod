import { LightningElement,wire,api,track } from 'lwc';
import getjobApplications from '@salesforce/apex/RegistrationForm.getjobApplications';
import sendOfferLetterEmail from '@salesforce/apex/EmailSender.sendOfferLetterEmail';

import { updateRecord } from 'lightning/uiRecordApi';
// import { getRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CemsJobApplication extends LightningElement {
      @track jobApplications;
    @track modalContainer = false;
    @track recordid;
    @track isModalOpen = false;
      @track displayModelRow = {};
      @track selectedRecordId;
    @track isEditing = false;
    @track showOfferLetter = false;
    @track preScreenButton = false;
    @track showPrescreening = false;
      @api selectedJobApplicationId;
      
      

  @wire(getjobApplications)
  wiredJobApplications({ error, data }) {
console.log('data',data);
console.log('data',JSON.stringify(data));

    if (data) {
      this.jobApplications = data.map((record) => {
        const jobOpeningName = record.CEMS_Job_Opening__r ? record.CEMS_Job_Opening__r.Name : '';
        return { ...record, jobOpeningName };

      });
    } else if (error) {
      // Handle error if needed
      console.error('Error retrieving job applications:', error);
    }
  }

  showPreScreen(){
    this.showPrescreening = true;
  }

  hidePreScreen(){
    this.showPrescreening = false;
  }

  get columns() {
    return [
    //   { label: 'Job application Id', fieldName: 'Name' },

    {
      label: 'Edit',
      type: 'button-icon',
      initialWidth: 75,
      typeAttributes: {
        iconName: 'action:edit',
        title: 'Edit',
        variant: 'border-filled',
        alternativeText: 'Edit',
        recordId: { fieldName: 'Id' }
      }
    },
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
      type: 'text',
      cellAttributes: { iconName: 'standard:job_position' }
    },  
    
    { label: 'Skills', fieldName: 'CEMS_Skills__c' },  
    {label:'Stage',fieldName:'CEMS_Stage__c'},
    {label:'Status',fieldName:'CEMS_Status__c'},
    // {label:'RefferedBy',fieldName:'CEMS_Referral__c'},

    // { label: 'Pre-Screen Score', fieldName: 'CEMS_Screening_Exam_Score__c' },  
    // {label:'Pre-Screen Result',fieldName:'CEMS_Results__c'},
    // {label:'Expected_Salary',fieldName:'CEMS_Expected_Salary__c'},
    // {label:'Negotiated-Salary',fieldName:'CEMS_Negotiated_Salary__c'}



     // Add more columns as needed
    ];
  }

    handleRowAction(event) {
      const recordId = event.detail.row.Id;
    
      const action = event.detail.action;
      this.selectedRecordId = recordId;
      this.isModalOpen = true;
    const dataRow = event.detail.row;
    this.recordid = event.detail.row.Id; // Retrieve the record ID
    console.log('dataRow@@ :' + JSON.stringify(dataRow));
    console.log('recordId@@ :' + this.recordid);
    this.displayModelRow = dataRow;

    // Check the Status field value to determine if the button should be displayed
    if (dataRow.CEMS_Status__c === 'Accepted' && dataRow.CEMS_Stage__c === 'Release Offer Letter') {
      this.showOfferLetter = true;
    } else {
      this.showOfferLetter = false;
    }
    if( !dataRow.CEMS_Status__c && !dataRow.CEMS_Stage__c ){
      this.preScreenButton = true;
    } else {
      this.preScreenButton = false;
    }
    console.log('contactRow## ' + JSON.stringify(dataRow));
    this.modalContainer = true;

  if (action.name === 'edit') {
      this.displayModelRow = row;
      this.showEditModal = true;
    }
  
}

sendOfferLetter() {
    // Call the Apex method to send the offer letter email
    sendOfferLetterEmail({ recordId: this.displayModelRow.Id })
        .then(() => {
            // Email sent successfully, perform any additional actions if needed
            this.showToast('Success', 'Offer letter email sent successfully.', 'success');
        })
        .catch(error => {
            // Handle any error occurred during email sending
            this.showToast('Error', 'An error occurred while sending the offer letter email.', 'error');
            console.error('Error sending email:', error);
        });

}

 handleSave(event) {
           this.closeModalAction();

       event.preventDefault();

   console.log('kjs');
  const fields = event.detail.fields;
       console.log('fields',fields);

    const recordId = this.displayModelRow.Id;
           console.log('recordId',recordId);


    // Set the record Id for update
  fields.Id = recordId;

    // Update the record using lightning/uiRecordApi
    updateRecord(recordInputs)
      .then(() => {
        // Record is saved successfully, perform any additional actions if needed
        this.showToast('Success', 'Record saved successfully.', 'success');
        this.closeModalAction();
      })
      .catch((error) => {
        // Handle any error occurred during record update
        this.showToast('Error', 'An error occurred while saving the record.', 'error');
        console.error('Error saving record:', error);
      });
  }

  

  // Helper method to show toast messages
  showToast(title, message, variant) {
    const toastEvent = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant,
    });
    this.dispatchEvent(toastEvent);
  }

closeModalAction() {
  this.modalContainer = false;
}

}