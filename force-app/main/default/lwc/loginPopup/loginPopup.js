import { LightningElement, track, api } from 'lwc';
import employeeGenerateOtpHandler from '@salesforce/apex/CEMS_LoginHandler.employeeGenerateOtpHandler';
import employeeValidateOtpHandler from '@salesforce/apex/CEMS_LoginHandler.employeeValidateOtpHandler';

export default class LoginPopup extends LightningElement {

  @track showLoginPage = true;
  @track isPopupOpen = false;

  @track timeout = 3000;
  @api isLoggedIn = false;
  @track sticky = false;

  @api email;
  loggedInEmail;
  loggedInAfter = false;
  empId;
  otp;


  showDropdown = false;
  dropdownOptions = [
    { label: 'Logout', value: 'logout' }
  ];


  connectedCallback() {
    this.loadRememberedData();
     this.loggedInEmail = this.email;
     this.isLoggedIn = true;
  }
 
  loadRememberedData() {
    this.empId = sessionStorage.getItem('rememberedempId');
    this.email = sessionStorage.getItem('rememberedemail');
    this.otp = sessionStorage.getItem('rememberedotp');
    this.isLoggedIn = sessionStorage.getItem('isloggedin') === 'true';
  }


  handleLogin() {
    this.isPopupOpen = true;
    this.showLoginPage = true;
    this.isLoggedIn = false;
    this.isOtpGenerated = false;
    //this.resetForm();
    this.dispatchEventisLoggedIn();
  }

  handleOtp() {
    this.empId = this.template.querySelector('[data-id="username"]').value;
    this.email = this.template.querySelector('[data-id="emailid"]').value;
    console.log(this.empId);
    console.log(this.email);

    if (!this.empId || !this.email) {
      this.template.querySelector("c-custom-toast-messages").showToast("error", "Please enter emailId and employeeId");
      return;
    }

    employeeGenerateOtpHandler({ employeeId: this.empId, emailId: this.email })
      .then(result => {
        this.template.querySelector("c-custom-toast-messages").showToast("success", "OTP Sent to given email please check spam if you dont find otp in inbox");

        this.isOtpGenerated = true;
        this.showLoginPage = false;
        this.isLoggedIn = false;
        console.log(result);
      }).catch(error => {
        this.template.querySelector("c-custom-toast-messages").showToast("error", "Please check entered Id and Email");

        console.log(JSON.stringify(error));
      });
  }

  validateOtp() {
    this.otp = this.template.querySelector('[data-id="otp"]').value;
    employeeValidateOtpHandler({ employeeId: this.empId, emailId: this.email, otp: this.otp })
      .then(result => {
        sessionStorage.setItem('rememberedempId', this.empId);
        sessionStorage.setItem('rememberedemail', this.email);
        sessionStorage.setItem('rememberedotp', this.otp);
        sessionStorage.setItem('isloggedin', 'true');
        console.log(result);
        this.template.querySelector("c-custom-toast-messages").showToast("success", "Login successful");
        this.isPopupOpen = false;
        this.isOtpGenerated = false;
        this.isLoggedIn = true;
        this.showLoginPage = false;
        this.loggedInEmail = this.email;
      }).catch(error => {
        console.error(JSON.stringify(error));
      });

  }


  handleFlagChange() {
    this.isLoggedIn = true;
    const event = new CustomEvent('flagchange', {
      detail: this.isLoggedIn
    });
    this.dispatchEvent(event);
  }
  get name() {
    return this.employee ? this.employee.Name : '';
  }

  get contactNumber() {
    return this.employee ? this.employee.CEMS_Contact_Number__c : '';
  }

  get street() {
    return this.employee ? this.employee.CEMSAddress__Street__s : '';
  }

  get country() {
    return this.employee ? this.employee.CEMSAddress__CountryCode__s : '';
  }

  get city() {
    return this.employee ? this.employee.CEMSAddress__City__s : '';
  }

  get state() {
    return this.employee ? this.employee.CEMSAddress__StateCode__c : '';
  }

  handleSuccess(event) {
    // Handle success event after record update
  }

  closePopup() {
    // Implement closePopup method logic
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

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  handleDropdownChange(event) {
    const selectedOption = event.detail.value;
    if (selectedOption === 'logout') {
      this.handleLogout();
    }
  }

  handleLogout() {
    this.isLoggedIn = false;

    this.showLoginPage = true;
    this.email = null;
    sessionStorage.clear();

    // Additional logout logic if needed
  }

  get showAvatar() {
    return this.isLoggedIn && !this.showLoginPage;
  }
  


}