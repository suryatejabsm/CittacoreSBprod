import { LightningElement, track, api } from 'lwc';
export default class CreateJobOpenings extends LightningElement {
    @api recordId;
    @track timeout = 3000;
    @track sticky = false;
    wiredRecord;
    @track openmodel = false;

    openmodal() {
        this.openmodel = true;
    }
    closeModal() {
        this.openmodel = false;
    }
    saveMethod() {

        this.closeModal();
    }
    // handleSubmit(event) {
    //     event.preventDefault();
    //     const fields = event.detail.fields;
    //     this.template.querySelector('lightning-record-edit-form').submit(fields);
    //     this.template.querySelector("c-custom-toast-messages").showToast("success", "Record created successfully.");

    // }
     handleSubmit(event) {
        console.log('onsubmit event recordEditForm'+ event.detail.fields);
        //this.allowReset();

    }
    handleSuccess(event) {
        console.log('onsuccess event recordEditForm', event.detail.id);
        this.template.querySelector("c-custom-toast-messages").showToast("success", "Record created successfully.");
    }
      handleError(event)
    {
        console.log(JSON.stringify(event.error));
    this.template.querySelector("c-custom-toast-messages").showToast("error",JSON.stringify(event.error));

      
    }
    createJonOpenings(){
        this.openmodel =true;

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
}