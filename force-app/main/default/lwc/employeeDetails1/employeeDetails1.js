import { LightningElement, wire, api, track } from 'lwc';
import getEmployee from '@salesforce/apex/AccountViewController.getEmployee';
import getEmployee1 from '@salesforce/apex/AccountViewController.getEmployee1';
export default class employeeDetails1 extends LightningElement {
    //@api emailid='shilpas@cittacore.com';
    emp;
    fileUpload = false;
    edit = false;
    @api recordId;
    @api email;
    street;
    citys;
    state;
    name;
    employee;
    contactNumber;
    country;
    isPopupOpen;
    @track showPopup = false;
    @track timeout = 3000;
    @track sticky = false;

    openPopup(event) {
        this.showPopup = true;
        this.edit = true;
        const buttonElement = this.template.querySelector('lightning-button-icon.form');
        buttonElement.style.display = 'none';
        

    }
    closePopup() {
        this.showPopup = false;
        const buttonElement = this.template.querySelector('lightning-button-icon.form');
        buttonElement.style.display = 'block';
    }
    // @wire(getEmployee, { email: '$email' })
    // wiredEmployee({ error, data }) {
    //     if (data) {
    //         this.employee = data;
    //     } else if (error) {
    //         console.error(error);
    //     }
    // }
    @wire(getEmployee,{ email: '$email' },
    console.log("em:"+this.email))
    wiredEmployee({ data, error }) {
        if (data) {
            if (data.length > 0) {
                //this.employee = data[0];
                // const recordId = employee.detail;
                // console.log('contrecid'+recordId);
                this.employee = {
                    ...data[0],
                    hrName: data[0].CEMS_HR_Manager__r ? data[0].CEMS_HR_Manager__r.Name : '',
                    cpName: data[0].CEMS_Position__r ? data[0].CEMS_Position__r.Name : ''
                };
                console.log("recordName:"+JSON.stringify(this.employee));
            } else {
                this.employee = null;
            }
            this.error = null;
        } else if (error) {
            this.employee = null;
            this.error = error;
            this.showErrorMessage('Error retrieving employee data');
            console.error(error);
        }
    }

    connectedCallback() {
        this.loademployee();
        //this.email = this.template.value;
    }
    handleRecordLoad(event) {
        // this.email = 'nalinirajus@cittacore.com';
       // this.getEmployeeRecord();
    }
    loademployee() {
        const emailParam = this.email;
        console.log('Email in loademployee:', emailParam); // Log email value
    
    getEmployee1({ email: emailParam },
        console.log("@@@@@eemailE@@@@@@"+emailParam)
        )
        .then(result => {
            console.log("######eeemail#######"+emailParam);
            if (result && result.length > 0) {
                this.emp = result;
                this.employee = {
                    Id: this.emp.Id,
                    Name: this.emp.Name,
                    CEMS_Contact_Number__c: this.emp.CEMS_Contact_Number__c,
                    CEMS_Work_Email__c: this.emp.CEMS_Work_Email__c,
                    CEMSAddress__Street__s: this.emp.CEMSAddress__Street__s,
                    CEMSAddress__City__s: this.emp.CEMSAddress__City__s,
                    CEMSAddress__StateCode__c: this.emp.CEMSAddress__StateCode__c,
                    CEMSAddress__CountryCode__s: this.emp.CEMSAddress__CountryCode__s,
                };
            } else {
                this.emp = null;
                this.employee = null; // Set employee to null if no data is found
                // Reset the values of other variables if necessary
            }
        })
        .catch(error => {
            console.error(error);
        });
}

handleUpdate() {
    const fields = {};
    fields.Id = this.employee.Id;
    fields.Name = this.employee.Name;
    fields.CEMS_Contact_Number__c = this.employee.CEMS_Contact_Number__c;
    fields.CEMS_Work_Email__c = this.employee.CEMS_Work_Email__c;
    fields.CEMSAddress__Street__s = this.employee.CEMSAddress__Street__s;
    fields.CEMSAddress__City__s = this.employee.CEMSAddress__City__s;
    fields.CEMSAddress__StateCode__c = this.employee.CEMSAddress__StateCode__c;
    fields.CEMSAddress__CountryCode__s = this.employee.CEMSAddress__CountryCode__s;
        this.template.querySelector('lightning-record-edit-form').submit();
    }

    editaction() {
        this.edit = true;
        this.isPopupOpen = true;
    }
  
    handleSuccess(event) {
    event.preventDefault();
    const fields = event.detail.fields;
    const recordId = this.employee.Id;
    fields.Id = recordId;
    this.template
        .querySelector('lightning-record-edit-form')
        .submit(fields)
        .then(() => {
            this.showPopup = false;
            this.template
                .querySelector('c-custom-toast-messages')
                .showToast('success', 'Record updated successfully.');
            this.loademployee(); // Reload the employee data
        })
        .catch((error) => {
            console.error(error);
            this.template
                .querySelector('c-custom-toast-messages')
                .showToast('error', 'Error updating record.');
        });
}

}