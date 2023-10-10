/*
import { LightningElement, track, api } from 'lwc';
import getAllCEMSTrainings from '@salesforce/apex/AccountViewController.getAllCEMSTrainings';

export default class CemsDisplayTrainings extends LightningElement {
    @track trainingList;
  displayedTrainingList;
  pageSize = 12;
  @track currentPage = 1;
  showPagination = false;
  totalRecords = 0;
  @api email;

  connectedCallback() {
    this.loadEmployeeTrainings();
  }

  handlePagination(event) {
    this.currentPage = event.detail;
    this.updateDisplayedTrainingList();
  }

  updateDisplayedTrainingList() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = this.currentPage * this.pageSize;
    this.displayedTrainingList = this.trainingList.slice(start, end);
    
  }

  loadEmployeeTrainings() {
    getAllCEMSTrainings()
      .then(result => {
        this.trainingList = result;
        console.log('----retrieved data:::'+ JSON.stringify(this.trainingList));
        this.totalRecords = result.length;
        this.updateDisplayedTrainingList();
        this.showPagination = this.totalRecords > this.pageSize;
        this.currentPage=1;
      })
      .catch(error => {
        console.error('Error retrieving employee trainings:', error);
        this.trainingList = [];
      });
  }
}*/

import { LightningElement, track, api } from 'lwc';
import getAllCEMSTrainings from '@salesforce/apex/AccountViewController.getAllCEMSTrainings';
import insertEmployeeTraining from '@salesforce/apex/AccountViewController.insertEmployeeTraining';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CemsDisplayTrainings extends LightningElement {
  @track trainingList;
  certificates = [];
  learnings = [];
  @api email;
  registeredItems = new Set();
  
 

  connectedCallback() {
    this.loadEmployeeTrainings();
    this.loadRegisteredItemsFromLocalStorage();
   
  }
  
  loadRegisteredItemsFromLocalStorage() {
    const registeredItemsStr = window.localStorage.getItem('registeredItems');
    if (registeredItemsStr) {
      this.registeredItems = new Set(JSON.parse(registeredItemsStr));
    }
  }
  

  loadEmployeeTrainings() {
    getAllCEMSTrainings()
      .then(result => {
        this.trainingList = result;
        //console.log('----retrieved data:::' + JSON.stringify(this.trainingList));

        const certificateRecordTypeId = '012DO0000008XdvYAE'; // Replace with the actual Certificate Record Type Id
        const learningRecordTypeId = '012DO0000008Xe0YAE'; // Replace with the actual Learning Record Type Id
        console.log(' this.trainingList');
        this.certificates = this.trainingList.filter(training => training.RecordTypeId === certificateRecordTypeId);
        console.log('Certificates fileds :::'+JSON.stringify( this.certificates));
        this.learnings = this.trainingList.filter(training => training.RecordTypeId === learningRecordTypeId);
        console.log('Learning fileds :::'+JSON.stringify(this.learnings));
      })
      .catch(error => {
        console.error('Error retrieving employee trainings:', error);
        this.trainingList = [];
      });
  }

  
  isCertificatesTabSelected = true;

  isLearningsTabSelected = false;


  get certificatesTabClass() {
    return this.isCertificatesTabSelected ? 'slds-tabs_default__content slds-show' : 'slds-tabs_default__content slds-hide';
  }

  get learningsTabClass() {
    return this.isLearningsTabSelected ? 'slds-tabs_default__content slds-show' : 'slds-tabs_default__content slds-hide';
  }

  handleTabClick(event) {
    const selectedTab = event.target.dataset.tab;
 
    console.log('selectedTab',selectedTab);
    

    if (selectedTab === 'certificates') {
      this.isCertificatesTabSelected = true;
      this.isLearningsTabSelected = false;

    } else if (selectedTab === 'learnings') {
      this.isCertificatesTabSelected = false;
      this.isLearningsTabSelected = true;
    }
  }
  get displayedTrainingList() {
    return this.isCertificatesTabSelected ? this.displayedCertificates : this.displayedLearnings;
  }
  

  toggleCertificateDetails(event) {
    const certificateId = event.target.dataset.id;
    console.log('certificate Id:::::'+certificateId);
    const detailsElement = this.template.querySelector(`.certificate-details[data-id="${certificateId}"]`);
   
    detailsElement.hidden = !detailsElement.hidden;
  }

  toggleLearningDetails(event) {
    const learningId = event.target.dataset.id; 
    console.log('Learning Id:::::'+learningId);
    // this.selectedLearning= this.learnings.find(learning => learning.Id === recordId);
    const detailsElement = this.template.querySelector(`.learning-details[data-id="${learningId}"]`);
    detailsElement.hidden = !detailsElement.hidden;
  }
  handleRegisterClick(event) {
    const selectedItemId = event.target.dataset.id;
    console.log('Selected Id by click--' + selectedItemId);
    const selectedTraining = this.certificates.find((certificate) => certificate.Id === selectedItemId) ||
      this.learnings.find((learning) => learning.Id === selectedItemId);
    console.log('Selected training by click--', JSON.stringify(selectedTraining));
  
    if (selectedTraining) {
      if (this.registeredItems.has(selectedItemId)) {
        // Item is already registered
        this.template.querySelector("c-custom-toast-messages").showToast("warning", "Good to see you again! Your registration is already complete.");
        return;
      }
  
      insertEmployeeTraining({ email: this.email, trainingRecordId: selectedItemId })
        .then((result) => {
          console.log('result===', result);
          this.registeredItems.add(selectedItemId); // Add the item to the registered items set
          this.template.querySelector("c-custom-toast-messages").showToast("success", "Thank you! Registered Successfully");
          const toastEvent = new ShowToastEvent({
            title: 'Success',
            message: result,
            variant: 'success',
          });
          this.dispatchEvent(toastEvent);
  
          // Disable the link after registering
          const registerLink = this.template.querySelector(`a[data-id="${selectedItemId}"]`);
          if (registerLink) {
            registerLink.disabled = true;
  
            // Store the registered item ID in Local Storage
            const registeredItemsStr = window.localStorage.getItem('registeredItems');
            let registeredItems = registeredItemsStr ? JSON.parse(registeredItemsStr) : [];
            registeredItems.push(selectedItemId);
            window.localStorage.setItem('registeredItems', JSON.stringify(registeredItems));
          }
        })
        .catch((error) => {
          console.error('Error occurred during employee training registration:', error);
        });
    }
  }
  
  // Pagination properties
  @track currentPage = 1;
  itemsPerPage = 8;
  get displayedCertificates() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.certificates.slice(startIndex, endIndex);
  }

  get displayedLearnings() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.learnings.slice(startIndex, endIndex);
  }
  get isPaginationVisible() {
    const totalItems = this.isCertificatesTabSelected ? this.certificates.length : this.learnings.length;
    return totalItems > this.itemsPerPage;
  }
  get displayedTrainingList() {
    return this.isCertificatesTabSelected ? this.displayedCertificates : this.displayedLearnings;
  }
  get isPreviousDisabled() {
    return this.currentPage === 1;
  }

  get isNextDisabled() {
    const totalItems = this.isCertificatesTabSelected ? this.certificates.length : this.learnings.length;
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    return this.currentPage >= totalPages;
  }

  handlePrevious() {
    if (!this.isPreviousDisabled) {
      this.currentPage -= 1;
    }
  }

  handleNext() {
    if (!this.isNextDisabled) {
      this.currentPage += 1;
    }
  }

  
}