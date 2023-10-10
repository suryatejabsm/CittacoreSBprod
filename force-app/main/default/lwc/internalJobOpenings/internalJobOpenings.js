import { LightningElement, api, wire, track } from 'lwc';
import getJobOpenings from '@salesforce/apex/AccountViewController.getJobOpenings';
import searchJobOpenings from '@salesforce/apex/AccountViewController.searchJobOpenings';
import { createMessageContext, releaseMessageContext, publish } from 'lightning/messageService';
import getTechnologyOptions from '@salesforce/apex/AccountViewController.getTechnologyOptions';
import getExperienceOptions from '@salesforce/apex/AccountViewController.getExperienceOptions';
import getLocationOptions from '@salesforce/apex/AccountViewController.getLocationOptions';
import applicantGenerateOtpHandler from '@salesforce/apex/CEMS_LoginHandler.applicantGenerateOtpHandler';
import retrieveJobApplications from '@salesforce/apex/RegistrationForm.retrieveJobApplications';

//import JOBCHANNEL from "@salesforce/messageChannel/JobOpeningChannel__c";
export default class InternalJobOpenings extends LightningElement {
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
  isJobOpeningPopupOpen = false;
  selectedJobOpening = null;
  openLoginOrRegisterPage = false;
  applicantLoginPage = false;
  applicantName;
  applicantEmail;
  newjobopenings = false;
  openjobapp = false;
  openjobappbutton = false;
  @track jobApplications;

  connectedCallback() {
    this.loadJobOpenings();
  }
  createJonOpenings() {
    this.newjobopenings = true;
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

  loadJobOpenings() {
    getJobOpenings()
      .then(result => {
        this.jobOpeningList = result;
        this.filteredJobOpenings = result;
      })
      .catch(error => {
        console.error('Error retrieving job openings:', error);
        this.jobOpeningList = [];
        this.filteredJobOpenings = [];
      });
  }

  handleFilterChange(event) {
    this.selectedTechnology = event.detail.technology;
    console.log('st2 ' + this.selectedTechnology);
    this.filterJobOpenings();
  }

  handleExpChange(event) {
    this.selectedExperience = event.detail.experience;
    this.filterJobOpenings();
  }

  handleSearch(event) {
    this.searchQuery = event.target.value.toLowerCase();
    this.searchJobOpenings();
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
      }
      return true; // Include job opening if it passes all filters
    });
  }


  searchJobOpenings() {
    if (this.searchQuery) {
      searchJobOpenings({ searchKey: this.searchQuery })
        .then(result => {
          console.log("*****SearchJobOpenings*****"+result);
          this.filteredJobOpenings = result;
        })
        .catch(error => {
          console.error('Error searching job openings:', error);
          this.filteredJobOpenings = [];
        });
    } else {
      this.filteredJobOpenings = this.jobOpeningList;
    }
  }
  openJobOpeningPopup(event) {
    event.preventDefault();
    this.openjobapp = false;
    this.openjobappbutton = true;
    const recordId = event.target.dataset.value;
    this.selectedJobOpening = this.jobOpeningList.find(jobOpening => jobOpening.Id === recordId);
    console.log(recordId);
    this.isJobOpeningPopupOpen = true;

  }
  loadRelatedJobApplications() {
    if (this.selectedJobOpening) {
      const jobOpeningId = this.selectedJobOpening.Id;
      console.log('jobOpeningId', jobOpeningId);
      this.retrieveJobApplications(jobOpeningId);
    }
  }
  // Add the retrieveJobApplications method
  retrieveJobApplications(jobOpeningId) {
    retrieveJobApplications({ jobOpeningId: jobOpeningId })
      .then(result => {
        console.log('=====result=====', result);
       // this.jobApplications = result;
        this.jobApplications = result.map((record) => {
        const jobOpeningName = record.CEMS_Job_Opening__r ? record.CEMS_Job_Opening__r.Name : '';
        console.log("*******jobOpeningName********"+jobOpeningName);
        return { ...record, jobOpeningName };
      });
      })
      .catch(error => {
        console.error('Error retrieving job applications:', error);
        this.jobApplications = [];
      });
        
     
  }

  closeJobOpeningPopup() {
    this.isJobOpeningPopupOpen = false;
    this.selectedJobOpening = null;
  }
  handleResetFilter(event) {
    event.preventDefault();
    this.filteredJobOpenings = this.jobOpeningList;
    let dt = this.template.querySelector('lightning-combobox[data-id="technology"]');
    let et = this.template.querySelector('lightning-combobox[data-id="experience"]');
    let et2 = this.template.querySelector('lightning-combobox[data-id="location"]');

    dt.value = '';
    et.value = '';
    et2.value = '';
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

  closeApplicantLoginPage() {
    this.openLoginOrRegisterPage = false;
    this.applicantLoginPage = false;
    this.applicantValidateOtp = false;
  }
  openJobApplication() {
    this.openjobappbutton = false;
    this.openjobapp = true;

    const jobOpeningId = this.selectedJobOpening.Id;
    this.retrieveJobApplications(jobOpeningId);
    this.selectedJobOpening = false;


  }


  get columns() {
    return [
      {
        label: 'Job Opening',
        fieldName: 'jobOpeningName',
        type: 'text',
        cellAttributes: { iconName: 'standard:job_position' }
      },
      { label: 'Name', fieldName: 'CEMS_Last_Name__c' },
      { label: 'Email', fieldName: 'CEMS_Email__c' },
      {
        label: 'Job application Id',
        fieldName: 'Name',
        type: 'text',
        cellAttributes: { iconName: 'standard:user', iconPosition: 'left' },
        typeAttributes: {
          label: { fieldName: 'CEMS_First_Name__c' },
          title: { fieldName: 'CEMS_Last_Name__c' }
        }
      }
      
      // Add more columns as needed
    ];
  }
}