import { LightningElement, track, api } from 'lwc';
import getEmployeeTrainings1 from '@salesforce/apex/AccountViewController.getEmployeeTrainings1';

export default class cemsTrainingShowAllLearnings extends LightningElement {
  @track employeeTrainingList;
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
    this.displayedTrainingList = this.employeeTrainingList.slice(start, end);
    
  }

  loadEmployeeTrainings() {
    getEmployeeTrainings1({ email: this.email })
      .then(result => {
        this.employeeTrainingList = result;
        console.log('----retrieved data:::'+ JSON.stringify(this.employeeTrainingList));
        this.totalRecords = result.length;
        this.updateDisplayedTrainingList();
        this.showPagination = this.totalRecords > this.pageSize;
        this.currentPage=1;
      })
      .catch(error => {
        console.error('Error retrieving employee trainings:', error);
        this.employeeTrainingList = [];
      });
  }


}