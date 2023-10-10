import { api, LightningElement,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';

export default class ForLeaveObject extends LightningElement {
    @api recordId;
    @track timeout = 3000;
    @track sticky = false;
    wiredRecord;
//    @track showComponent = false;
   @track showModal = false;
   


    handleSave(event) {
      event.preventDefault();
      const fields = event.detail.fields;
      this.template.querySelector('lightning-record-edit-form').submit(fields);
      this.template.querySelector("c-custom-toast-messages").showToast("success", "Leave Applied Successfully");
      this.showModal = false;

    }
    
    allowReset() {
   const inputFields = this.template.querySelectorAll(
       'lightning-input-field'
   );
   if (inputFields) {
       inputFields.forEach(field => {
           field.reset();
       });
   }
}

// handleApply(){
//    this.showComponent =true;
// }
handleApply() {
    this.showModal = true;
}

handleCancel() {
    this.showModal = false;
}
// handleSave() {
//         const inputFields = this.template.querySelectorAll('lightning-input-field');

//         // Validate if all required fields are filled
//         let isValid = true;
//         inputFields.forEach(field => {
//             if (!field.checkValidity()) {
//                 field.reportValidity();
//                 isValid = false;
//             }
//         });

//         if (isValid) {
//             const fields = {};
//             inputFields.forEach(field => {
//                 fields[field.fieldName] = field.value;
//             });

//             const recordInput = { apiName: 'cems_leave__c', fields };

//             createRecord(recordInput)
//                 .then(result => {
//                     console.log('result',result);
//                     this.showModal = false;
//                     this.showToast('Success', 'Record saved successfully!', 'success');
//                 })
//                 .catch(error => {
//                     this.showToast('Error', 'An error occurred while saving the record.', 'error');
//                     console.error('Error saving record:', error);
//                 });
//         }
//     }

      
}