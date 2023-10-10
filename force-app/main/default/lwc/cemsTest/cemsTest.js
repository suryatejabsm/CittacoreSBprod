import { LightningElement, api, wire, track } from 'lwc';
//import getJobOpenings from '@salesforce/apex/AccountViewController.getJobOpenings';
import searchJobOpenings from '@salesforce/apex/AccountViewController.searchJobOpenings';
import { createMessageContext, releaseMessageContext, publish } from 'lightning/messageService';
import getTechnologyOptions from '@salesforce/apex/AccountViewController.getTechnologyOptions';
import register from '@salesforce/apex/RegistrationForm.Register';
import getExperienceOptions from '@salesforce/apex/AccountViewController.getExperienceOptions';
import getLocationOptions from '@salesforce/apex/AccountViewController.getLocationOptions';
import applicantGenerateOtpHandler from '@salesforce/apex/CEMS_LoginHandler.applicantGenerateOtpHandler';
import applicantValidateOtpHandler from '@salesforce/apex/CEMS_LoginHandler.applicantValidateOtpHandler';
import getJobOpen from '@salesforce/apex/CEMS_PerformanceDataCreation.getJobOpen';
import handleUpload from '@salesforce/apex/AccViewContlr.uploadFile2';

//import JOBCHANNEL from "@salesforce/messageChannel/JobOpeningChannel__c";
export default class ExternalJobs extends LightningElement {
  context = createMessageContext();
  @api email;
  @track jobOpeningList;
  @track jobOpeningList1;

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
  otp;
  @api usEmail;
  pageSize = 12;
  @track currentPage = 1;
  //@api itemsPerPage = 9; // Number of items to display per page
  showPagination=false;
  totalRecords=0;

   @track  firstName;
   @track  lastName;
   @track  email;
   @track  phone;
   @track  address;
   @track  highestDegree;
   @track  qualification;
   @track  cgpa;
   @track   role;
   @track   experience;
   @track  previousCompany;
   @track   panNumber;
   @track   panCard;
   @track   resume;
   @track   city;
   @track street;
   @track  country;
   @track  postalCode;
 pageSize = 12;
  @track currentPage = 1;

  showPagination = false;
  totalRecords = 0;

 
@track fileName = '';
    @track fileContents;
    @track fileReader;
    @track isFileSelected = false;

    @api userEmail;

    handleFileChange(event) {
        this.isFileSelected = false;
        const file = event.target.files[0];
        this.fileName = file.name;

        this.fileReader = new FileReader();
        this.fileReader.onloadend = () => {
            this.fileContents = this.fileReader.result;
            this.isFileSelected = true;
        };

        this.fileReader.readAsDataURL(file);
    }

    handleUploadFile() {
        if (!this.isFileSelected) {
            return;
        }

        handleUpload({ 
            base64File: this.fileContents.split(',')[1], // Remove data:application/pdf;base64, part
            fileName: this.fileName,
            userEmail: this.userEmail
        })
        .then(result => {
          console.log("result:::::"+JSON.stringify(result));
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'File uploaded successfully',
                    variant: 'success'
                })
            );
            // Perform any additional actions after successful file upload
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Error uploading file: ' + error,
                    variant: 'error'
                })
            );
        });
    }
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

  @wire(getExperienceOptions)
  wiredExperienceOptions({ error, data }) {
    if (data) {
      this.experienceOptions = data.map(item => ({ label: item, value: item }));
      console.log('expoptions ' + JSON.stringify(this.experienceOptions));
    } else if (error) {
      console.error('Error retrieving experience pickList values:', error);
    }
  }

  handleTechnologyChange(event) {
    this.selectedTechnology = event.target.value;
    console.log(' this.selectedTechnology+++++' + this.selectedTechnology);
    this.filterJobOpenings();
  }


  handleLocationChange(event) {
   this.selectedLocation = event.target.value;
    console.log(' this.selectedTechnology+++++' + this.selectedLocation);
    this.filterJobOpenings();
  }

handleExperience(event) {
  this.selectedExp = event.target.value;
  console.log('this.selectedExp: ' + this.selectedExp);
  this.filterJobOpenings();
}


  handlePagination(event) {
  const pageNumber = event.detail;
  this.currentPage = pageNumber;

  this.filterJobOpenings();
}

filterJobOpenings() {
  let filteredList = this.jobOpeningList.filter(jobOpening => {
    let matchTechnology = !this.selectedTechnology || jobOpening.CEMS_Technology__c === this.selectedTechnology;
    let matchLocation = !this.selectedLocation || jobOpening.CEMS_Job_Location__c === this.selectedLocation;
    let matchExperience = !this.selectedExp || jobOpening.CEMS_Experience__c === this.selectedExp;

    return matchTechnology && matchLocation && matchExperience;
  });

  this.totalRecords = filteredList.length;
  const totalPages = Math.ceil(this.totalRecords / this.pageSize);
  if (this.currentPage > totalPages) {
    this.currentPage = totalPages;
  }

  const start = (this.currentPage - 1) * this.pageSize;
  const end = this.currentPage * this.pageSize;
  this.filteredJobOpenings = filteredList.slice(start, end);
  this.showPagination = this.totalRecords > this.pageSize;
}



  loadJobOpenings() {
    getJobOpen({ userEmail: this.usEmail })
      .then((result) => {
        this.jobOpeningList = result;
        this.totalRecords = result.length;
        this.currentPage = 1;
        this.filterJobOpenings();
      })
      .catch((error) => {
        console.error("Error retrieving job openings:", error);
        this.jobOpeningList = [];
        this.filteredJobOpenings = [];
      });
  }


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
  }
  

  handleResetFilter(event) {
    event.preventDefault();
    this.selectedTechnology = '';
    this.selectedExp = '';
    this.selectedLocation = '';
    this.searchQuery = '';

    this.currentPage = 1;
    this.filterJobOpenings();
    
  }


  searchJobOpenings() {
    if (this.searchQuery) {
      searchJobOpenings({ searchKey: this.searchQuery })
        .then(result => {
          this.filteredJobOpenings = result;
          this.totalRecords = result.length; // Update the total number of records
          this.currentPage = 1; // Reset the current page to 1
          this.showPagination = this.totalRecords > this.pageSize;

          // Slice the filteredJobOpenings based on the current page and page size
          const start = (this.currentPage - 1) * this.pageSize;
          const end = this.currentPage * this.pageSize;
          this.filteredJobOpenings = this.filteredJobOpenings.slice(start, end);
        })
        .catch(error => {
          console.error('Error searching job openings:', error);
          this.filteredJobOpenings = [];
        });
    } else {
      // If search query is empty, reset the filteredJobOpenings and pagination
      this.filteredJobOpenings = this.jobOpeningList;
      this.totalRecords = this.jobOpeningList.length;
      this.currentPage = 1;
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;
      this.filteredJobOpenings = this.filteredJobOpenings.slice(start, end);
      this.showPagination = this.totalRecords > this.pageSize;
    }
  }
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

  applicantLoginGenerateOtp() {
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

  applicantLoginValidateOtp(){
    this.otp = this.template.querySelector('[data-id="otp"]').value;

    applicantValidateOtpHandler({name: this.applicantName, email: this.applicantEmail, otp: this.otp})
    .then(result => {
      console.log(result);
    this.closeApplicantLoginPage();
       this.template.querySelector("c-custom-toast-messages").showToast("success", "Login successful");

    })
    .catch(error => {
            console.log(JSON.stringify(error));
             this.template.querySelector("c-custom-toast-messages").showToast("error", "An Error Occured While Logging You In");
          });

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
    this.isJobOpeningPopupOpen = false;
     this.resetForm();
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
  if (
    !this.firstName ||
    !this.lastName ||
    !this.email ||
    !this.phone ||
    !this.city ||
    !this.street ||
    !this.country ||
    !this.postalCode ||
    !this.highestDegree ||
    !this.qualification ||
    !this.cgpa
  ) {
    this.template.querySelector("c-custom-toast-messages").showToast(
      "error",
      "Please enter all the required fields"
    );
    return;
  }

  // Check if files are selected
  if (!this.panCard || !this.resume) {
    this.template.querySelector("c-custom-toast-messages").showToast(
      "error",
      "Please select both PAN Card and Resume files"
    );
    return;
  }

  const panCardAttachmentPromise = this.readFileContents(this.panCard);
  console.log('panCardAttachmentPromise',panCardAttachmentPromise);
  const resumeAttachmentPromise = this.readFileContents(this.resume);
  console.log('resumeAttachmentPromise',resumeAttachmentPromise);

  Promise.all([panCardAttachmentPromise, resumeAttachmentPromise])
    .then((results) => {
      console.log('results',results);
      const panCardContents = results[0];
      const resumeContents = results[1];

      const panCardAttachment = {
        fileName: this.panCard.name,
        fileContents: panCardContents,
      };
            console.log('panCardAttachment',panCardAttachment.fileName);


      const resumeAttachment = {
        fileName: this.resume.name,
        fileContents: resumeContents,
      };
                  console.log('resumeAttachment',resumeAttachment.fileName);


      const attachments = [panCardAttachment, resumeAttachment];

      register({
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
        city: this.city,
        attachments: attachments,
      })
        .then((result) => {
          // Record creation successful
          // Perform any additional actions or show success message
          this.closeApplicantLoginPage();

          this.template.querySelector("c-custom-toast-messages").showToast(
            "success",
            "Registration successful"
          );
          console.log("Registration successful:", result);
        })
        .catch((error) => {
          console.error("Error occurred while registering:", error);
          this.template.querySelector("c-custom-toast-messages").showToast(
            "error",
            "An error occurred while registering"
          );
        });
    })
    .catch((error) => {
      console.error("Error occurred while reading files:", error);
      this.template.querySelector("c-custom-toast-messages").showToast(
        "error",
        "An error occurred while reading files"
      );
    });
}

readFileContents(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const dataURL = event.target.result;
      console.log('dataURL',dataURL);
      resolve(dataURL);
    };

    reader.onerror = (event) => {
      reject(event.target.error);
    };

    reader.readAsDataURL(file);
  });
}



  resetForm() {
        this.currentStep = 1;
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.phone = '';
        this.address = '';
        this.highestDegree = '';
        this.qualification = '';
        this.cgpa = '';
        this.experience = '';
        this.previousCompany = '';
        this.role = '';
        this.panCard = '';
        this.panNumber = '';
        this.resume = '';
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
    handleAdddressChange(event){
        this.address = event.target.value;
    }
    handleRoleChange(event){
        this.role = event.target.value;
    }
    handlePanChange(event){
        this.panNumber = event.target.value;

    }
    handleFileChange1(event){
        this.panCard = event.target.files[0];
        console.log('thispanCard', this.panCard);

    }
    handleFileChange(event){
        this.resume = event.target.files[0];
                console.log(' thisresume',  this.resume);


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