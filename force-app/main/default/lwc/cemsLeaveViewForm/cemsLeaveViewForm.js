import { LightningElement, track, wire, api } from 'lwc';
import getLeaveRecords from '@salesforce/apex/RegistrationForm.getLeaveRecords';
import getEmployee1 from '@salesforce/apex/AccountViewController.getEmployee1';



export default class CemsLeaveViewForm extends LightningElement {
  @track leaveRecords;
  @track currentPage = 1;
  @api itemsPerPage = 3; // Number of items to display per page
  @track pageSize = 5;
  @track cemsLeave = false;
  @api recordId;
  @track timeout = 3000;
  @track sticky = false;
  wiredRecord;
  @track showModal = false;
   @api email;
   totalAccounts = 0;
   @track loggedInUserName;
   emp;
  @track employeeresult ;
  @track employeeName;



 connectedCallback() {
        this.loademployee();
        //this.email = this.template.value;
    }

   handlePagination(event) {
    this.currentPage = event.detail;
    const start = (this.currentPage - 1) * this.pageSize;
    const end = this.pageSize * this.currentPage;
    this.leaveRecords = this.leaveRecords.slice(start, end);
}

  handleSave(event) {
    event.preventDefault();
    const fields = event.detail.fields;
    this.template.querySelector('lightning-record-edit-form').submit(fields);
    this.template.querySelector("c-custom-toast-messages").showToast("success", "Leave Applied Successfully");
    this.showModal = false;

  }


  // Assuming you have a JavaScript controller or component
handleSubmit(event) {
    event.preventDefault(); // Prevents the form submission

    // Access the form inputs using event.target
    const fields = event.target.fields;
    const recordInput = { apiName: "CEMS_Leave__c", fields };

    // Call the Lightning Data Service's createRecord method to insert the record
    createRecord(recordInput)
        .then(() => {
            // Handle success
            console.log("Record created successfully");
            // Reset any necessary form fields or close the modal
        })
        .catch((error) => {
            // Handle error
            console.error("Error creating record", error);
            // Display an error message or take appropriate action
        });
}

  
  allowReset() {
 const inputFields = this.template.querySelectorAll(
     'lightning-input-field'
 );
 if (inputFields) {
     inputFields.forEach(field => {
         field.reset();
     });
 }
}

// handleApply(){
//    this.showComponent =true;
// }
handleApply() {
  this.showModal = true;
}

handleCancel() {
  this.showModal = false;
}
  // Compute the total number of pages based on the itemsPerPage and total items count
  get totalPages() {
    return Math.ceil((this.leaveRecords && this.leaveRecords.length) / this.itemsPerPage);
  }


  // @wire(getLeaveRecords,{ email: '$email' })
  // wiredLeaveRecords({ error, data }) {
  //   console.log('data',data);
  //   if (data) {
  //    this.loggedInUserName = data.CEMS_Employee__r.Name;
  //    console.log('loggedInUserName',this.loggedInUserName);
  //     this.totalAccounts = data.length;
  //     console.log('totalAccounts',this.totalAccounts);
  //     this.leaveRecords = data.map((record) => {
  //         const EmployeeName = record.CEMS_Employee__r ? record.CEMS_Employee__r.Name : '';
  //         return { ...record, EmployeeName };
         
  //     });
  //     console.log('leaveRecords',this.leaveRecords);
  //     const start = (this.currentPage - 1) * this.pageSize;
  //     const end = this.pageSize * this.currentPage;
  //     this.leaveRecords = this.leaveRecords.slice(start, end);
  // } else if (error) {
  //     console.error('Error retrieving leave records:', error);
  // }
  // }

 loademployee() {
        getEmployee1({ email: this.email })
            .then(result => {
                console.log("result:" + JSON.stringify(result));
                this.employeeresult = result.map((record) => {
                    const employeeName = record.Name;
                    console.log('employeeName',employeeName);
                    return { ...record, employeeName };
                });
                this.employeeName = this.employeeresult[0].employeeName;
                console.log('employeeName', this.employeeName);
            })
            .catch(error => {
                console.error(error);
            });
    }

  
  get columns() {
    return [
      //   { label: 'Job application Id', fieldName: 'Name' },

      // { label: 'Leave ID', fieldName: 'Name' },
      //  {
      //   label: 'Name',
      //   fieldName: 'EmployeeName',
      //   type: 'text',
      //   cellAttributes: { iconName: 'standard:user', iconPosition: 'left' },
      // }, 
      { label: 'Type', fieldName: 'CEMS_Type_Of_Leave__c' },
      { label: ' Leave Status', fieldName: 'CEMS_Leave_Status__c' },
      { label: 'Reason', fieldName: 'CEMS_Reason__c' },
      { label: 'Start Date', fieldName: 'CEMS_Leave_Start_Date__c' },
      { label: 'End Date', fieldName: 'CEMS_Leave_End_Date__c' }
      
      // { type: "button", typeAttributes: {  
      //       label: 'Edit',  
      //       name: 'Edit',  
      //       title: 'Edit',  
      //       disabled: false,  
      //       value: 'edit',  
      //       iconPosition: 'left'  
      //   } 
      // }
      // Add more columns as needed
    ];
  }


  handleRowAction(event) {
    const row = event.detail.row;
    const recId = event.detail.row.Id;
    const actionName = event.detail.action.name;
    // Row index (-1 to account for header row)
    console.log('=====' + row + '==recId==' + recId + '===actionName====' + actionName);

    // Use either of these to get the row data from the table data
  }




}