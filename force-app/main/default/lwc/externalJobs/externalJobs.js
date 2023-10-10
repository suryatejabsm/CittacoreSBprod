import { LightningElement, api, wire, track } from 'lwc';
import getJobOpenings from '@salesforce/apex/AccountViewController.getJobOpenings';
import searchJobOpenings from '@salesforce/apex/AccountViewController.searchJobOpenings';
import { createMessageContext, releaseMessageContext, publish } from 'lightning/messageService';
import getTechnologyOptions from '@salesforce/apex/AccountViewController.getTechnologyOptions';
import Register from '@salesforce/apex/RegistrationForm.Register';
import getExperienceOptions from '@salesforce/apex/AccountViewController.getExperienceOptions';
import getLocationOptions from '@salesforce/apex/AccountViewController.getLocationOptions';
import applicantGenerateOtpHandler from '@salesforce/apex/CEMS_LoginHandler.applicantGenerateOtpHandler';
//import getJobOpen from '@salesforce/apex/CEMS_PerformanceDataCreation.getJobOpen';

//import JOBCHANNEL from "@salesforce/messageChannel/JobOpeningChannel__c";
export default class ExternalJobs extends LightningElement {
  context = createMessageContext();
  @track jobOpeningList;
  @track filteredJobOpenings = [];
  @track selectedTechnology = '';
  @track selectedExperience = '';
  @track selectedLocation = '';
  @track technologyOptions = [];
  @track experienceOptions = [];
  @track locationOptions = [];
  @track searchQuery = '';
  @track showRegistrationPage = false;
  @track showPersonalDetails = true;
  @track showEducationDetails = false;
  @track showExperienceDetails = false;
  @track currentStep = 1;
  @track timeout = 3000;
  @track sticky = false;
  isJobOpeningPopupOpen = false;
  selectedJobOpening = null;
  openLoginOrRegisterPage = false;
  applicantLoginPage = false;
  applicantName;
  applicantEmail;
  @api usEmail = 'nalinirajus@cittacore.com';
  pageSize = 12;
  @track currentPage = 1;
  //@api itemsPerPage = 9; // Number of items to display per page
  showPagination = false;
  totalRecords = 0;

  @track firstName;
  @track lastName;
  @track email;
  @track phone;
  @track address;
  @track highestDegree;
  @track qualification;
  @track cgpa;
  @track role;
  @track experience;
  @track previousCompany;
  @track panNumber;
  @track panCard;
  @track resume;
  @track city;
  @track street;
  @track country;
  @track postalCode;
@api email;
  connectedCallback() {
    this.loadJobOpenings();
  }

  @wire(getTechnologyOptions)
  wiredTechnologyOptions({ error, data }) {
    if (data) {
      // Map the picklist values to options array
      this.technologyOptions = data.map(item => ({ label: item, value: item }));
      console.log('options ' + JSON.stringify(this.technologyOptions));
    } else if (error) {
      console.error('Error retrieving technology picklist values:', error);
    }
  }

  @wire(getLocationOptions)
  wiredLocationOptions({ error, data }) {
    if (data) {
      // Map the picklist values to options array
      this.locationOptions = data.map(item => ({ label: item, value: item }));
      console.log('options ' + JSON.stringify(this.locationOptions));
    } else if (error) {
      console.error('Error retrieving technology picklist values:', error);
    }
  }


  handleTechnologyChange(event) {
    this.selectedTechnology = event.target.value;
    console.log(' this.selectedTechnology+++++' + this.selectedTechnology);
    this.filterJobOpenings();
  }
  handleLocationChange(event) {
    this.selectedLocation = event.target.value;
    console.log(' this.selectedLocation+++++' + this.selectedLocation);
    this.filterJobOpenings();


  }

  @wire(getExperienceOptions)
  wiredExperienceOptions({ error, data }) {
    if (data) {
      this.experienceOptions = data.map(item => ({ label: item, value: item }));
      console.log('expoptions ' + JSON.stringify(this.experienceOptions));
    } else if (error) {
      console.error('Error retrieving experience pickList values:', error);
    }
  }

  handleExperienceChange(event) {
    this.selectedExperience = event.target.value;
    this.filterJobOpenings();

  }

  handlePagination(event) {
    // const pageNumber = event.detail;
    // const start = (pageNumber - 1) * this.itemsPerPage;
    // const end = pageNumber * this.itemsPerPage;

    // if (start >= this.totalRecords) {
    //   this.jobOpeningList = [];
    // } else {
    //   this.jobOpeningList = this.filteredJobOpenings.slice(start, end);
    // }
    // const pageNumber = event.detail;
    // const start = (pageNumber - 1) * this.itemsPerPage;
    // const end = pageNumber * this.itemsPerPage;
    // this.jobOpeningList = this.filteredJobOpenings.slice(start, end);
    const pageNumber = event.detail;
    this.currentPage = pageNumber;
    const start = (pageNumber - 1) * this.pageSize;
    const end = pageNumber * this.pageSize;
    this.filteredJobOpenings = this.jobOpeningList.slice(start, end);
    this.showPagination = this.totalRecords > this.pageSize;
  }

  loadJobOpenings() {
    getJobOpenings()
      .then((result) => {
        console.log('result',result);
        this.jobOpeningList = result;
        this.filteredJobOpenings = result;
        this.totalRecords = result.length;
        this.filteredJobOpenings = this.jobOpeningList.slice(0, this.pageSize);
        this.showPagination = this.totalRecords > this.pageSize;
      })
      .catch((error) => {
        console.error("Error retrieving job openings:", error);
        this.jobOpeningList = [];
        this.filteredJobOpenings = [];
      });
  }


  /*  handleFilterChange(event) {
      this.selectedTechnology = event.detail.technology;
      console.log('st2 ' + this.selectedTechnology);
      this.filterJobOpenings();
    }
  
    handleExpChange(event) {
      this.selectedExperience = event.detail.experience;
      this.filterJobOpenings();
    } */

  handleSearch(event) {
      this.searchQuery = event.target.value.toLowerCase();
  if (this.searchQuery.length >= 2) {
    this.searchJobOpenings();
  } else {
    this.filteredJobOpenings = this.jobOpeningList;
       this.currentPage = 1; // Reset the current page to 1
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;
      this.filteredJobOpenings = this.filteredJobOpenings.slice(start, end);
      this.showPagination = this.totalRecords > this.pageSize;
  }
    // this.searchQuery = event.target.value.toLowerCase();
    // this.searchJobOpenings();
    //  this.currentPage = 1; // Reset the current page to 1
    //   const start = (this.currentPage - 1) * this.pageSize;
    //   const end = this.currentPage * this.pageSize;
    //   this.filteredJobOpenings = this.filteredJobOpenings.slice(start, end);
    //   this.showPagination = this.totalRecords > this.pageSize;
  }

  filterJobOpenings() {
    this.filteredJobOpenings = this.jobOpeningList.filter(jobOpening => {
      if (this.selectedTechnology && jobOpening.CEMS_Technology__c !== this.selectedTechnology) {
        return false; // Filter out if technology doesn't match
      }
      if (this.selectedExperience && jobOpening.CEMS_Experience__c !== this.selectedExperience) {
        return false; // Filter out if experience doesn't match
      }
      if (this.selectedLocation && jobOpening.CEMS_Job_Location__c !== this.selectedLocation) {
        return false; // Filter out if experience doesn't match
      }    this.showPagination = this.totalRecords > this.pageSize;

      return true; // Include job opening if it passes all filters
    });
  }

  handleResetFilter(event) {
    event.preventDefault();
    this.searchQuery = '';
    this.filteredJobOpenings = this.jobOpeningList;
    let dt = this.template.querySelector('lightning-combobox[data-id="technology"]');
    let et = this.template.querySelector('lightning-combobox[data-id="experience"]');
    let et2 = this.template.querySelector('lightning-combobox[data-id="location"]');

    dt.value = '';
    et.value = '';
    et2.value = '';

    // Reset pagination properties
    this.currentPage = 1;
    const start = (this.currentPage - 1) * this.pageSize;
    const end = this.currentPage * this.pageSize;
    this.filteredJobOpenings = this.filteredJobOpenings.slice(start, end);
    this.showPagination = this.totalRecords > this.pageSize;
  }


  searchJobOpenings() {
    if (this.searchQuery) {
      searchJobOpenings({ searchKey: this.searchQuery })
        .then(result => {
          this.filteredJobOpenings = result;
          this.currentPage = 1; // Reset the current page to 1
          this.showPagination = this.totalRecords > this.pageSize;
        })
        .catch(error => {
          console.error('Error searching job openings:', error);
          this.filteredJobOpenings = [];
        });
    } else {
      this.filteredJobOpenings = this.jobOpeningList;
      this.currentPage = 1; // Reset the current page to 1
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;
      this.filteredJobOpenings = this.filteredJobOpenings.slice(start, end);
      this.showPagination = this.totalRecords > this.pageSize;

    }
  }




  // searchJobOpenings() {
  //   if (this.searchQuery) {
  //     searchJobOpenings({ searchKey: this.searchQuery })
  //       .then(result => {
  //         this.filteredJobOpenings = result;
  //               })
  //       .catch(error => {
  //         console.error('Error searching job openings:', error);
  //         this.filteredJobOpenings = [];
  //       });
  //   } else {
  //     this.filteredJobOpenings = this.jobOpeningList;
  //   }
  // }

  openJobOpeningPopup(event) {
    event.preventDefault();
    const recordId = event.target.dataset.value;
    this.selectedJobOpening = this.jobOpeningList.find(jobOpening => jobOpening.Id === recordId);
    this.isJobOpeningPopupOpen = true;
  }

  closeJobOpeningPopup() {
    this.isJobOpeningPopupOpen = false;
    this.selectedJobOpening = null;
  }

  // handleResetFilter(event) {
  //   event.preventDefault();
  //   this.filteredJobOpenings = this.jobOpeningList;
  //   let dt = this.template.querySelector('lightning-combobox[data-id="technology"]');
  //   let et = this.template.querySelector('lightning-combobox[data-id="experience"]');
  //   let et2 = this.template.querySelector('lightning-combobox[data-id="location"]');

  //   dt.value = '';
  //   et.value = '';
  //   et2.value = '';
  //    // Reset pagination properties

  // }

  underlineFirstPTag(event) {
    const card = event.currentTarget;
    const firstPTag = card.querySelector('p');

    firstPTag.style.textDecoration = 'underline';
  }

  removeUnderlineFirstPTag(event) {
    const card = event.currentTarget;
    const firstPTag = card.querySelector('p');

    firstPTag.style.textDecoration = 'none';
  }

  applyNow(event) {
    console.log(this.selectedJobOpening);
    this.openLoginOrRegisterPage = true;
    this.applicantLoginPage = true;
    this.isJobOpeningPopupOpen = false;
    this.applicantValidateOtp = false;
  }

  applicantLoginGenerateOtp(event) {
    this.applicantName = this.template.querySelector('[data-id="name"]').value;
    console.log(this.applicantName);
    this.applicantEmail = this.template.querySelector('[data-id="applicantemail"]').value;
    console.log(this.applicantEmail);
    try {
      applicantGenerateOtpHandler({ name: this.applicantName, email: this.applicantEmail })
        .then(result => {
          console.log(result);
          this.applicantLoginPage = false;
          this.applicantValidateOtp = true;
        }).catch(error => {
          console.log(JSON.stringify(error));
        });
    }
    catch (error) {
      console.log(JSON.stringify(error));
    }
  }


  showRegistrationForm() {
    this.showRegistrationPage = true;
    this.applicantLoginPage = false;
    this.applicantValidateOtp = false;
  }

  closeApplicantLoginPage() {
    this.openLoginOrRegisterPage = false;
    this.applicantLoginPage = false;
    this.applicantValidateOtp = false;
    this.showRegistrationPage = false;
  }



  handleNext() {
    if (this.currentStep < 4 && this.currentStep >= 1) {
      this.currentStep++;
      this.updateFormVisibility();
    }
  }
  handlePrevious() {
    if (this.currentStep > 1 && this.currentStep <= 4) {
      this.currentStep--;
      this.updateFormVisibility();
    }
  }

  updateFormVisibility() {
    this.showPersonalDetails = this.currentStep === 1;
    this.showEducationDetails = this.currentStep === 2;
    this.showExperienceDetails = this.currentStep === 3;
    this.showKycDetails = this.currentStep === 4;
  }

  handleRegistration() {
    // this.template.querySelector("c-custom-toast-messages").showToast("error", "An error occured while registering");
    Register({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      highestDegree: this.highestDegree,
      qualification: this.qualification,
      cgpa: this.cgpa,
      panNumber: this.panNumber,
      experience: this.experience,
      previousCompany: this.previousCompany,
      role: this.role,
      postalCode: this.postalCode,
      street: this.street,
      country: this.country,
      city: this.city

    })
      .then((result) => {
        // Record creation successful
        // Perform any additional actions or show success message
        this.template.querySelector("c-custom-toast-messages").showToast("success", "Registration successful");
        console.log('registration successful' + result)
      })
      .catch((error) => {
        console.log('Error' + JSON.stringify(error));
        // Handle any errors that occurred during record creation
        this.template.querySelector("c-custom-toast-messages").showToast("error", "An error occured while registering");
      });
  }

  //event Handlers for form field changes
  handleFirstNameChange(event) {
    this.firstName = event.target.value;
  }

  handleLastNameChange(event) {
    this.lastName = event.target.value;
  }

  handleLoginEmailChange(event) {
    this.email = event.target.value;
  }

  handleRegistrationEmailChange(event) {
    this.email = event.target.value;
  }

  handleRegistrationPhoneChange(event) {
    this.phone = event.target.value;
  }

  handleRegistrationAddressChange(event) {
    this.address = event.target.value;
  }

  handleHighestDegreeChange(event) {
    this.highestDegree = event.target.value;
  }

  handleQualificationChange(event) {
    this.qualification = event.target.value;
  }

  handleCGPAChange(event) {
    this.cgpa = event.target.value;
  }

  handleExperienceChange(event) {
    this.experience = event.target.value;
  }

  handleCompanyChange(event) {
    this.previousCompany = event.target.value;
  }
  handleAdddressChange(event) {
    this.address = event.target.value;
  }
  handleRoleChange(event) {
    this.role = event.target.value;
  }
  handlePanChange(event) {
    this.panNumber = event.target.value;

  }
  handleUploadPanChange(event) {
    this.panCard = event.target.value;

  }
  handleUploadResumeChange(event) {
    this.resume = event.target.value;

  }
  handleStreetChange(event) {
    this.street = event.target.value;
  }

  handleCityChange(event) {
    this.city = event.target.value;
  }

  handleCountryChange(event) {
    this.country = event.target.value;
  }

  handlePostalCodeChange(event) {
    this.postalCode = event.target.value;
  }

}