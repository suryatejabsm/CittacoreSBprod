import { LightningElement, wire, track,api } from 'lwc';
import GetEmployeeProjects from '@salesforce/apex/AccountViewController.GetEmployeeProjects';

export default class EmployeeProject extends LightningElement {
  error;
  isLoading = true;
  @track employeeProjectList;
  @track IsProjectDetails = false;
  selectedProject = null;
  @api email;
  employeetabs;
  pageSize = 7;
  @track currentPage = 1;
  //@api itemsPerPage = 9; // Number of items to display per page
  showPagination=false;
  totalRecords=0;
  connectedCallback() {
    this.loadEmployeeProjects();
  }
  handlePagination(event) {
    this.currentPage = event.detail;
    this.updateDisplayedTrainingList();
  }

  updateDisplayedTrainingList() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = this.currentPage * this.pageSize;
    this.employeetabs = this.employeeProjectList.slice(start, end);
  }

  loadEmployeeProjects() {
    GetEmployeeProjects({email:this.email})
      .then(result => {
        //this.employeeProjectList = result;
        console.log("RES:"+JSON.stringify(result));
        this.employeeProjectList = result.map(proj => ({
          ...proj,
          employeeName: proj.CEMS_Employee__r ? proj.CEMS_Employee__r.Name : '',
          projectName: proj.CEMS_Projects__r ? proj.CEMS_Projects__r.CEMS_Projects__c : '',
          isExpanded: false
          
        }));
        this.totalRecords = result.length;
        this.updateDisplayedTrainingList();
        this.showPagination = this.totalRecords > this.pageSize;
        this.currentPage = 1;
        this.isLoading = false;
      })
      .catch(error => {
        console.error('Error retrieving projects:', error);
        this.employeeProjectList = [];
        this.isLoading = false;
      });
  }
  handleToggleClick(event) {
    const recordId = event.target.dataset.value;
    const clickedTraining = this.employeeProjectList.find(proj => proj.Id === recordId);
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
  handleProjectClick(event) {
    const projectId = event.currentTarget.dataset.value;
    this.selectedProject = this.employeeProjectList.find(project => project.Id === projectId);
    if(this.IsProjectDetails == true)
    {
      this.IsProjectDetails = false;

    }
    else this.IsProjectDetails = true;
  }
}