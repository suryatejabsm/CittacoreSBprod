import { api, LightningElement } from "lwc";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { deleteRecord } from "lightning/uiRecordApi";

export default class DeleteInterviews extends LightningElement {
    @api recordId;
    showConfirmationModal = false;
  
    openConfirmationModal() {
      this.showConfirmationModal = true;
    }
  
    closeConfirmationModal() {
      this.showConfirmationModal = false;
    }
  
    handleDelete() {
        console.log('Deleting record with ID:', this.recordId);
      
        deleteRecord(this.recordId)
          .then(() => {
            console.log('Record deleted successfully');
            this.dispatchEvent(
              new ShowToastEvent({
                title: 'Success',
                message: 'Record deleted',
                variant: 'success'
              })
            );
            this.closeConfirmationModal();
          })
          .catch((error) => {
            console.error('Error deleting record:', error);
          });
      }
    }