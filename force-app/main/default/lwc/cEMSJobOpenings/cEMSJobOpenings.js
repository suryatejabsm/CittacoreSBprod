import { LightningElement,api,wire,track } from 'lwc';
import getJobOpenings from '@salesforce/apex/AccountViewController.getJobOpenings';
import searchJobOpenings from '@salesforce/apex/AccountViewController.searchJobOpenings';
import { createMessageContext, releaseMessageContext, publish } from 'lightning/messageService';
import getTechnologyOptions from '@salesforce/apex/AccountViewController.getTechnologyOptions';
import getExperienceOptions from '@salesforce/apex/AccountViewController.getExperienceOptions';
//import JOBCHANNEL from "@salesforce/messageChannel/JobOpeningChannel__c";
export default class CEMSJobOpenings extends LightningElement {

    context = createMessageContext();

  @track jobOpeningList;
  @track filteredJobOpenings = [];
  @track selectedTechnology = '';
  @track selectedExperience = '';
   @track technologyOptions = [];
   @track experienceOptions = [];
  @track searchQuery = '';


  connectedCallback() {
    this.loadJobOpenings();
  }

  @wire(getTechnologyOptions)
    wiredTechnologyOptions({ error, data }) {
        if (data) {
            // Map the picklist values to options array
            this.technologyOptions = data.map(item => ({ label: item, value: item }));
            console.log('options '+ JSON.stringify(this.technologyOptions));
        } else if (error) {
            console.error('Error retrieving technology picklist values:', error);
        }
    }

    handleTechnologyChange(event) {
        this.selectedTechnology = event.target.value;
        this.filterJobOpenings();
    }

     @wire(getExperienceOptions)
    wiredExperienceOptions({error,data }){
        if(data){
            this.experienceOptions = data.map(item =>({ label : item, value: item}));
            console.log('expoptions '+ JSON.stringify(this.experienceOptions));
                } else if(error){
            console.error ( 'Error retrieving experience pickList values:', error);
        }
    }

    handleExperienceChange(event){
       this.selectedExperience = event.target.value;
       this.filterJobOpenings();
    }

  loadJobOpenings() {
    getJobOpenings()
      .then(result => {
        console.log('result',result);
        this.jobOpeningList = result;
        console.log('this.jobOpeningList'+JSON.stringify(this.jobOpeningList));
       this.filteredJobOpenings = result;
      })
      .catch(error => {
        console.error('Error retrieving job openings:', error);
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
    this.searchJobOpenings();
  }

  filterJobOpenings() {
    if (this.selectedTechnology) {
      // console.log('st '+ this.selectedTechnology);
      this.filteredJobOpenings = this.jobOpeningList.filter(jobOpening => {
        console.log('tech ' + jobOpening.EMS_Technology__c);
        return jobOpening.EMS_Technology__c === this.selectedTechnology;
      });
    }
    else if (this.selectedExperience) {
      this.filteredJobOpenings = this.jobOpeningList.filter(jobOpening => {
        return jobOpening.EMS_Experience__c === this.selectedExperience;
      });
    }
    else {
      this.filteredJobOpenings = this.jobOpeningList;
    }
  }

  searchJobOpenings() {
    if (this.searchQuery) {
      searchJobOpenings({ searchKey: this.searchQuery })
        .then(result => {
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
  handleClick(event) {
    event.preventDefault();
    const recordId = event.target.dataset.value;
    const message = {
      recordId: recordId,
      recordData: this.jobOpeningList
    };
    publish(this.context, JOBCHANNEL, message);
  }
  handleResetFilter(event) {
    event.preventDefault();
    this.filteredJobOpenings = this.jobOpeningList;
   let dt =  this.template.querySelector('lightning-combobox[data-id="technology"]');
   let et =  this.template.querySelector('lightning-combobox[data-id="experience"]');
   dt.value = '';
   et.value= '';
   
  }
}