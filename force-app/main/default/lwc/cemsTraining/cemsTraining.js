import { LightningElement, track, api } from 'lwc';
import getEmployeeTrainings from '@salesforce/apex/AccountViewController.getEmployeeTrainings';

export default class cemsTraining extends LightningElement {
  @track employeeTrainingList;
  displayedTrainingList;
  pageSize = 7;
  @track currentPage = 1;
  showPagination = false;
  totalRecords = 0;
  @api email;

  connectedCallback() {
    this.loadEmployeeTrainings();
  }
  handleToggleClick(event) {
    const recordId = event.target.dataset.value;
    const clickedTraining = this.displayedTrainingList.find(training => training.Id === recordId);
    const rowElement = event.currentTarget.closest('tr.toggle-btn');
  
    // Reset background color of all rows
    const allRows = this.template.querySelectorAll('tr.toggle-btn');
    allRows.forEach(row => {
      row.style.backgroundColor = '';
    });
  
    if (clickedTraining) {
      clickedTraining.isExpanded = !clickedTraining.isExpanded;
  
      const buttonIcon = event.target;
      if (clickedTraining.isExpanded) {
        buttonIcon.iconName = 'utility:chevrondown';
      } else {
        buttonIcon.iconName = 'utility:chevronright';
      }
    }
  
    // Change background color of clicked row
    rowElement.style.backgroundColor = '#f3f3f3';
  }
  

  handlePagination(event) {
    this.currentPage = event.detail;
    this.updateDisplayedTrainingList();
  }

  updateDisplayedTrainingList() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = this.currentPage * this.pageSize;
    this.displayedTrainingList = this.employeeTrainingList.slice(start, end);
  }

  loadEmployeeTrainings() {
    getEmployeeTrainings({ email: this.email })
      .then(result => {
        console.log("RES:"+JSON.stringify(result));
        this.employeeTrainingList = result.map(training => ({
          
          ...training,
          employeeName: training.CEMS_Employee__r ? training.CEMS_Employee_Name__r.Name : '',
          learningName: training.CEMS_Learning_Name__r ? training.CEMS_Learning_Name__r.CEMS_Learning_Name__c : '',
          isExpanded: false
          
        }));

        this.totalRecords = result.length;
        this.updateDisplayedTrainingList();
        this.showPagination = this.totalRecords > this.pageSize;
        this.currentPage = 1;
      })
      .catch(error => {
        console.error('Error retrieving employee trainings:', error);
        this.employeeTrainingList = [];
      });
  }
}