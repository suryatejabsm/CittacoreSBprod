import { LightningElement, track, wire, api } from 'lwc';
import getJobApplication from '@salesforce/apex/Prescreeningclass.getJobApplication';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import styles from './prescreening.css';

export default class CemsJobApplication extends LightningElement {
    @api recordId;
    @track jobApplication;
    styles = styles;

    connectedCallback() {
        this.loadJobApplication();
    }

    loadJobApplication() {
        if (this.recordId) {
            getJobApplication({ recordId: this.recordId })
                .then(result => {
                    if (result.length > 0) {
                        this.jobApplication = result[0];
                    }
                })
                .catch(error => {
                    this.showToast('Error', 'An error occurred while retrieving the job application.', 'error');
                });
        }
    }

    showToast(title, message, variant) {
        const toastEvent = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(toastEvent);
    }
}