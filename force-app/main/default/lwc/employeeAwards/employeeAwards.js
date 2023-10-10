import { LightningElement, wire, track, api } from 'lwc';
// import { refreshApex } from '@salesforce/apex';
import GetEmployeeAwards from '@salesforce/apex/AccountViewController.GetEmployeeAwards';
// import myPNG_icon from'@salesforce/resourceUrl/AwardPNG'
// export class cardWithIcon extends LightningElement{
//     awardPng = myPNG_icon;
// }
export default class AwardsList extends LightningElement {
  awards;
  error;
  isLoading = true;
  @track employeeAwardsList;
  pageSize = 4;
  @track currentPage = 1;
  //@api itemsPerPage = 9; // Number of items to display per page
  showPagination = false;
  totalRecords = 0;
  @api email;



  handlePagination(event) {
    const pageNumber = event.detail;
    this.currentPage = pageNumber;
    const start = (pageNumber - 1) * this.pageSize;
    const end = pageNumber * this.pageSize;
    this.awards = this.employeeAwardsList.slice(start, end);
  }
  /* @wire(getAllAwards)
   wiredAwards(result) {
       if (result.data) {
           this.awards = result.data;
           this.error = undefined;
       } else if (result.error) {
           this.error = result.error;
           this.awards = undefined;
       }
       this.isLoading = false;
   }
*/

  connectedCallback() {
    this.loadEmployeeAwards();
  }
  loadEmployeeAwards() {
    GetEmployeeAwards({ email: this.email })
      .then(result => {
        console.log("awards:" + JSON.stringify(result));
        this.employeeAwardsList = result.map((record) => {
          const employeeName = record.CEMS_Employee__r ? record.CEMS_Employee__r.Name : '';
          return { ...record, employeeName };
        });
        this.totalRecords = this.employeeAwardsList.length;
        this.awards = this.employeeAwardsList.slice(0, this.pageSize);
        this.showPagination = this.totalRecords > this.pageSize;
      })
      .catch(error => {
        console.error('Error retrieving job openings:', error);
        this.employeeAwardsList = [];
      });
  }
  
  // loadEmployeeAwards() {
  //   GetEmployeeAwards({ email: this.email })
  //     .then(result => {
  //       console.log("awards:" + JSON.stringify(result));
  //       this.employeeAwardsList = data.map((record) => {
  //         const employeeName = record.CEMS_Employee__r ? record.CEMS_Employee__r.Name : '';
  //         return { ...record, employeeName };
  //       });
  //       this.employeeAwardsList = result;
  //       this.totalRecords = result.length;
  //       this.awards = this.employeeAwardsList.slice(0, this.pageSize);
  //       this.showPagination = this.totalRecords > this.pageSize;
  //     })
  //     .catch(error => {
  //       console.error('Error retrieving job openings:', error);
  //       this.employeeAwardsList = [];

  //     });
  // }


  // refreshData() {
  //     this.isLoading = true;
  //     return refreshApex(this.wiredAwards);
  // }
}