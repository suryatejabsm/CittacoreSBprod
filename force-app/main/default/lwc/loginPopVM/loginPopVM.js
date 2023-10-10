import { LightningElement, track, api } from 'lwc';
import employeeGenerateOtpHandler from '@salesforce/apex/VMLoginHandler.employeeGenerateOtpHandler';
import employeeValidateOtpHandler from '@salesforce/apex/VMLoginHandler.employeeValidateOtpHandler';
import UserPermissionsCallCenterAutoLogin from '@salesforce/schema/User.UserPermissionsCallCenterAutoLogin';

export default class LoginPopup extends LightningElement {
    @track showLoginPage = false;
    @track isPopupOpen = false;
    @track isOtpGenerated = false;

    @track timeout = 3000;
    @track isLoggedIn = false;
    @track sticky = false;

    @api email;
    empId;
    otp;

    loggedInName = '';

    handleLogin() {
        this.isPopupOpen = true;
        this.showLoginPage = true;
    }

    handleOtp() {
        this.empId = this.template.querySelector('[data-id="username"]').value;
        this.email = this.template.querySelector('[data-id="emailid"]').value;

        employeeGenerateOtpHandler({ employeeId: this.empId, emailId: this.email })
            .then(result => {
                this.isOtpGenerated = true;
                this.showLoginPage = false;
            })
            .catch(error => {
                console.log(JSON.stringify(error));
            });
    }

    validateOtp() {
        this.otp = this.template.querySelector('[data-id="otp"]').value;
        employeeValidateOtpHandler({ employeeId: this.empId, emailId: this.email, otp: this.otp })
            .then(result => {
                this.template.querySelector("c-custom-toast-messages").showToast("success", "Registration successful");
                this.isPopupOpen = false;
                this.isOtpGenerated = false;
                this.fetchLoggedInUserName();
                const event = new CustomEvent('emailchange', {
                    detail: { email: this.email }
                });
                this.dispatchEvent(event);
            })
            .catch(error => {
                console.log(JSON.stringify(error));
            });
    }

    fetchLoggedInUserName() {
        // Simulating an API call to fetch the logged-in user's name
        // Replace with your actual logic to fetch the name
        setTimeout(() => {
            this.loggedInName = 'user.Personnel__c.Name';
        }, 2000);
    }

    handleCancel() {
        this.isPopupOpen = false;
        this.removeContainerClass();
    }

    handleClose() {
        this.isPopupOpen = false;
        this.showLoginPage = false;
        this.removeContainerClass();
    }

    addContainerClass() {
        const container = this.template.querySelector('.container');
        container.classList.add('is-popup-open');
    }

    removeContainerClass() {
        const container = this.template.querySelector('.container');
        container.classList.remove('is-popup-open');
    }
}