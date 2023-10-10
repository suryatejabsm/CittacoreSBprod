import { LightningElement, wire, track, api } from 'lwc';
import getEmployeeTrainings from '@salesforce/apex/AccountViewController.getEmployeeTrainings';

export default class CemsTrainings extends LightningElement {
    @track employeeTrainingList;
    @track currentPage = 1;
    @api itemsPerPage = 10; // Number of items to display per page
    @track pageSize = 10;
    // Compute the total number of pages based on the itemsPerPage and total items count
    get totalPages() {
        return Math.ceil((this.employeeProjectList && this.employeeProjectList.length) / this.itemsPerPage);
    }

    // Get the current page's items based on the currentPage and itemsPerPage
    get currentItems() {
        if (this.employeeProjectList) {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.employeeProjectList.slice(start, end);
        }
        return [];
    }

    get isFirstPage() {
        return this.currentPage === 1;
    }

    get isLastPage() {
        return this.currentPage === this.totalPages;
    }

    get isFirstRecord() {
        return this.currentPage === 1 && (!this.employeeProjectList || this.employeeProjectList.length === 0);
    }

    get isLastRecord() {
        return this.currentPage === this.totalPages && (!this.employeeProjectList || this.employeeProjectList.length === 0);
    }

    goToFirstRecord() {
        this.currentPage = 1;
    }

    goToLastRecord() {
        this.currentPage = this.totalPages;
    }

    // Method to navigate to the previous page
    goToPreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage -= 1;
        }
    }

    // Method to navigate to the next page
    goToNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage += 1;
        }
    }

    @wire(getEmployeeTrainings)
    loadEmployeeTrainings({ error, data }) {
        if (data) {
            try {
                console.log('get results' + JSON.stringify(data));
                this.employeeTrainingList = data;
            }
            catch (e) {
                console.error(JSON.stringify(e.message));
            }
        }
        else if (error) {
            console.error(error.message);
        }
    }
}