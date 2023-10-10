import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getEmployeeTrainings from '@salesforce/apex/AccViewContlr.getEmployeeTrainings';

export default class cMSTR extends LightningElement {
    @track employeeTrainingList;

    connectedCallback() {
        this.loadEmployeeTrainings();
    }

    loadEmployeeTrainings() {
        getEmployeeTrainings()
            .then(result => {
                this.employeeTrainingList = result;
            })
            .catch(error => {
                console.error('Error retrieving employee trainings:', error);
                this.employeeTrainingList = [];
            });
        }

        handleTrainingHover(event) {
            const trainingId = event.target.dataset.Employee_Training__c.recordId;
            if (trainingId) {
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: trainingId,
                        objectApiName: 'Employee_Training__c',
                        actionName: 'view'
                    }
                });
            }
        }
    }