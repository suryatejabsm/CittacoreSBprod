import { LightningElement, wire, api, track } from 'lwc';
import getPerformances from '@salesforce/apex/AccountViewController.getPerformances';

export default class EmployeePerformance extends LightningElement {
    performances;
    pageSize = 10;
    @track currentPage = 1;
    showPagination = false;
    totalRecords = 0;
    @api email;
    paginationperfomance;

    connectedCallback() {
        this.loadPerformances();
    }

    loadPerformances() {
        getPerformances({ email: this.email })
            .then(result => {
                console.log(result);
                this.performances = result.map(performance => ({
                    ...performance,
                    employeeName: performance.CEMS_Employee__r ? performance.CEMS_Employee__r.Name : '',
                    isExpanded: false // Set initial state to false
                }));
                this.totalRecords = this.performances.length;
                this.paginationperfomance = this.performances.slice(0, this.pageSize);
                this.showPagination = this.totalRecords > this.pageSize;
                this.currentPage = 1;
            })
            .catch(error => {
                console.error(error);
            });
    }

    handlePagination(event) {
        this.currentPage = event.detail;
        this.updateDisplayedTrainingList();
    }

    updateDisplayedTrainingList() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = this.currentPage * this.pageSize;
        this.paginationperfomance = this.performances.slice(start, end);
    }

    handleToggleClick(event) {
        const rowElement = event.currentTarget.closest('tr.toggle-btn');
        const recordId = event.currentTarget.dataset.value;
        const clickedPerformance = this.performances.find(performance => performance.Id === recordId);
    
        if (clickedPerformance) {
            clickedPerformance.isExpanded = !clickedPerformance.isExpanded;
        }
    
        // Change background color of clicked row
        rowElement.style.backgroundColor = clickedPerformance.isExpanded ? '#f3f3f3' : '';
    
        // Update the button icon
        const buttonIcon = rowElement.querySelector('lightning-button-icon');
        if (buttonIcon) {
            buttonIcon.iconName = clickedPerformance.isExpanded ? 'utility:chevrondown' : 'utility:chevronright';
        }
        this.updateDisplayedTrainingList();

    }
    
}