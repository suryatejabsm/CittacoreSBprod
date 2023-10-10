import { LightningElement, track } from 'lwc';
import getPaginatedJobOpeningDetails from '@salesforce/apex/JobOpeningsHelperV5.getPaginatedJobOpeningDetails';

export default class RestApi extends LightningElement {
    @track jobOpenings;
    @track pageNumber = 1;
    @track pageSize = 10;
    @track totalPages;
    @track totalRecords;
    @track keyword = 'Salesforce'; // Optional search keyword

    connectedCallback() {
        this.loadJobOpenings();
    }

    loadJobOpenings() {
        getPaginatedJobOpeningDetails({ pageNumber: this.pageNumber, pageSize: this.pageSize, keyword: this.keyword })
            .then(result => {
               // alert("result::::::"+JSON.stringify(result));
                if (result && Array.isArray(result)) {
                    this.jobOpenings = result.map((item, index) => ({ ...item, serialNumber: index + 1 }));
                   // alert(":::::this.jobOpenings::::::::::"+JSON.stringify(this.jobOpenings));
                    this.totalRecords = this.jobOpenings.length;
                    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                } else {
                    this.jobOpenings = [];
                    this.totalRecords = 0;
                    this.totalPages = 0;
                }
            })
            .catch(error => {
                console.error('Error loading job openings:', error);
                this.jobOpenings = [];
                this.totalRecords = 0;
                this.totalPages = 0;
            });
    }

    handlePrevious() {
        if (this.pageNumber > 1) {
            this.pageNumber--;
            this.loadJobOpenings();
        }
    }

    handleNext() {
        if (this.pageNumber < this.totalPages) {
            this.pageNumber++;
            this.loadJobOpenings();
        }
    }

    handleSearch(event) {
        this.keyword = event.target.value;
        this.pageNumber = 1; // Reset page number when searching
        this.loadJobOpenings();
    }
}