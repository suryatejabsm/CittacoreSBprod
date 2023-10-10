/*
import { LightningElement, track, wire, api } from 'lwc';
import getDataFromContact from '@salesforce/apex/CEMSSchedulerController.getInterviewData';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';


import Round_Field from '@salesforce/schema/CEMS_Internal_Scheduler__c.CEMS_Interview_Round__c';
const columns = [
    {
        label: 'View',
        type: 'button-icon',
        initialWidth: 75,
        typeAttributes: {
            iconName: 'action:preview',
            title: 'Preview',
            variant: 'border-filled',
            alternativeText: 'View',
            recordId: { fieldName: 'Id' }
        }
    },
    { label: 'Date', fieldName: 'formattedDate' },
    { label: 'Applicant', fieldName: 'Name' },
    { label: 'Status', fieldName: 'CEMS_Interview_Status__c' },
    { label: 'Panel', fieldName: 'CEMS_Interview_Panel__r.Name' },
    { label: 'Round', fieldName: 'CEMS_Interview_Round__c' },

];

export default class CEMSSchedulerTable extends LightningElement {
    @track columns = columns;
    @track contactRow;
    @track rowOffset = 0;
    @track recordList;
    @track modalContainer = false;
    @track displayModelRow;
    @track recordid;
    //@wire(getDataFromContact) wireContact;
    selectedRound = '';
    picklistValues; // Add roundOptions property
    showFormInParent = true;
    selectedDateTime;
    interviewData;
    

    originalColumns = [...this.columns]; // Store original columns for reference
    @wire(getPicklistValues, { recordTypeId: '012DO0000008XetYAE', fieldApiName: Round_Field })
    loadPicklistValues({ data, error }) {
        if (data) {
            this.picklistValues = data.values;
            console.log(this.picklistValues);
        } else if (error) {
            // Handle error if necessary
            console.error('Error loading picklist values:', error);
        }
    }
    originalData = [];
    @wire(getDataFromContact)
    wiredInterviewData({ error, data }) {
        if (data) {
            this.originalData = [...data]; // Assign the original data
            this.interviewData = this.formatData(data);
            this.interviewData = data.map(record => {
                if (record.CEMS_Interview_Panel__r) {
                    return Object.assign(
                        { "CEMS_Interview_Panel__r.Name": record.CEMS_Interview_Panel__r.Name },
                        record
                    );
                }
                return record;
            });
            console.log(JSON.stringify(this.interviewData));
        } else if (error) {
            // Handle error if needed
        }
    }

    @wire(getDataFromContact)
    wiredInterviewData({ error, data }) {
      if (data) {
        const formattedData = this.formatData(data);
        this.originalData = [...formattedData]; // Assign the original data
        this.interviewData = formattedData.map(record => {
          if (record.CEMS_Interview_Panel__r) {
            return Object.assign(
              { "CEMS_Interview_Panel__r.Name": record.CEMS_Interview_Panel__r.Name },
              record
            );
          }
          return record;
        });
        console.log(JSON.stringify(this.interviewData));
      } else if (error) {
        // Handle error if needed
      }
    }
    
    formatData(data) {
        return data.map(record => {
          let formattedDate = '';
          if (record.CEMS_Interview_Start_Time__c) {
            const date = new Date(record.CEMS_Interview_Start_Time__c);
            if (!isNaN(date)) {
              const day = date.getDate().toString().padStart(2, '0');
              const month = (date.getMonth() + 1).toString().padStart(2, '0');
              const year = date.getFullYear();
              formattedDate = `${day}/${month}/${year}`;
            }
          }
          return {
            ...record,
            formattedDate
          };
        });
      }
      

    handleRowAction(event) {
        // const dataRow = event.detail.row;
        // console.log('dataRow@@ ' + JSON.stringify(dataRow));
        // this.displayModelRow = dataRow;
        // console.log('contactRow## ' + JSON.stringify(dataRow));
        // this.modalContainer = true;
        const dataRow = event.detail.row;
        this.recordid = event.detail.row.Id; // Retrieve the record ID
        console.log('dataRow@@ :' + JSON.stringify(dataRow));
        console.log('recordId@@ :' + this.recordid);
        this.displayModelRow = dataRow;
        console.log('contactRow## ' + JSON.stringify(dataRow));
        this.modalContainer = true;
    }

    closeModalAction() {
        this.modalContainer = false;
        // console.log("hello:" + this.contactRow);
        // setTimeout(() => {
        //     eval("$A.get('e.force:refreshView').fire();");
        // }, 1000);

    }
    

   

    handleScheduleInterview() {
        // Logic to handle the "Schedule Interview" event
        this.showFormInParent = false;

    }

    handleOpenScheduleInterview() {
        // Logic to handle the "Schedule Interview" event
        this.showFormInParent = true;

    }
    handleRoundChange(event) {
        this.selectedRound = event.detail.value;
        this.filterDataByRound();
    }
    
    handleDateTimeChange(event) {
        this.selectedDateTime = event.target.value;
        this.filterDataByDateTime();
    }

    filterDataByRound() {
        if (this.selectedRound) {
            const filteredData = this.originalData.filter(record =>
                record.CEMS_Interview_Round__c === this.selectedRound
            );
            this.interviewData = filteredData.map(record => {
                if (record.CEMS_Interview_Panel__r) {
                    return Object.assign(
                        { "CEMS_Interview_Panel__r.Name": record.CEMS_Interview_Panel__r.Name },
                        record
                    );
                }
                return record;
            });
        } else {
            // No round selected, display all records
            this.interviewData = this.originalData.map(record => {
                if (record.CEMS_Interview_Panel__r) {
                    return Object.assign(
                        { "CEMS_Interview_Panel__r.Name": record.CEMS_Interview_Panel__r.Name },
                        record
                    );
                }
                return record;
            });
        }
        this.columns = this.originalColumns; // Reset columns to original state
    }

    handleResetFilter() {
        this.interviewData = this.originalData.map(record => {
            if (record.CEMS_Interview_Panel__r) {
                return Object.assign(
                    { "CEMS_Interview_Panel__r.Name": record.CEMS_Interview_Panel__r.Name },
                    record
                );
            }
            return record;
        });
        this.columns = this.originalColumns;

        let interviewRound = this.template.querySelector('lightning-combobox[data-id="resetPicklist"]');
        interviewRound.value = '';

        let interviewDate = this.template.querySelector('lightning-input[data-id="resetPicklist"]');
        interviewDate.value = '';
    }
    
    filterDataByDateTime() {
        if (this.selectedDateTime) {
            const selectedDate = new Date(this.selectedDateTime).toDateString();
            const filteredData = this.originalData.filter(record =>
                new Date(record.CEMS_Interview_Start_Time__c).toDateString() === selectedDate
            );
            this.interviewData = filteredData.map(record => {
                if (record.CEMS_Interview_Panel__r) {
                    return Object.assign(
                        { "CEMS_Interview_Panel__r.Name": record.CEMS_Interview_Panel__r.Name },
                        record
                    );
                }
                return record;
            });
        } else {
            // No date/time selected, display all records
            this.interviewData = this.originalData.map(record => {
                if (record.CEMS_Interview_Panel__r) {
                    return Object.assign(
                        { "CEMS_Interview_Panel__r.Name": record.CEMS_Interview_Panel__r.Name },
                        record
                    );
                }
                return record;
            });
        }


    }
    @api displayModelRow;
    @api recordid;
    get shouldDisplayFeedback() {
        return this.displayModelRow.CEMS_Interview_Status__c === 'Completed';
      }
      handleDateTimeChange(event) {
        this.selectedDateTime = event.target.value;
        this.filterData();
      }
      
      handleRoundChange(event) {
        this.selectedRound = event.target.value;
        this.filterData();
      }

      filterData() {
        if (this.selectedRound && this.selectedDateTime) {
          // Filter by both round and date/time
          const selectedDate = new Date(this.selectedDateTime).toDateString();
          const filteredData = this.originalData.filter(record =>
            record.CEMS_Interview_Round__c === this.selectedRound &&
            new Date(record.CEMS_Interview_Start_Time__c).toDateString() === selectedDate
          );
          this.interviewData = filteredData.map(record => {
            if (record.CEMS_Interview_Panel__r) {
              return Object.assign(
                { "CEMS_Interview_Panel__r.Name": record.CEMS_Interview_Panel__r.Name },
                record
              );
            }
            return record;
          });
        } else if (this.selectedRound) {
          // Filter by round only
          const filteredData = this.originalData.filter(record =>
            record.CEMS_Interview_Round__c === this.selectedRound
          );
          this.interviewData = filteredData.map(record => {
            if (record.CEMS_Interview_Panel__r) {
              return Object.assign(
                { "CEMS_Interview_Panel__r.Name": record.CEMS_Interview_Panel__r.Name },
                record
              );
            }
            return record;
          });
        } else if (this.selectedDateTime) {
          // Filter by date/time only
          const selectedDate = new Date(this.selectedDateTime).toDateString();
          const filteredData = this.originalData.filter(record =>
            new Date(record.CEMS_Interview_Start_Time__c).toDateString() === selectedDate
          );
          this.interviewData = filteredData.map(record => {
            if (record.CEMS_Interview_Panel__r) {
              return Object.assign(
                { "CEMS_Interview_Panel__r.Name": record.CEMS_Interview_Panel__r.Name },
                record
              );
            }
            return record;
          });
        } else {
          // No round or date/time selected, display all records
          this.interviewData = this.originalData.map(record => {
            if (record.CEMS_Interview_Panel__r) {
              return Object.assign(
                { "CEMS_Interview_Panel__r.Name": record.CEMS_Interview_Panel__r.Name },
                record
              );
            }
            return record;
          });
        }
      
        this.columns = this.originalColumns; // Reset columns to original state
      }
}
*/
import { LightningElement, track, wire, api } from 'lwc';

import getDataFromContact2 from '@salesforce/apex/CEMSSchedulerController.getInterviewData2';

import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import IS_FEEDBACK_SUBMITTED from '@salesforce/schema/CEMS_Internal_Scheduler__c.CEMS_IsFeedbackSubmitted__c';



import Round_Field from '@salesforce/schema/CEMS_Internal_Scheduler__c.CEMS_Interview_Round__c';
const columns = [
    {
        label: 'Feedback',
        type: 'button-icon',
        initialWidth: 100,
        typeAttributes: {
            iconName: 'action:preview',
            title: 'Preview',
            variant: 'border-filled',
            alternativeText: 'View',
            recordId: { fieldName: 'Id' }
        }
    },
    { label: 'Date', fieldName: 'formattedDateTime' },
    { label: 'Applicant', fieldName: 'Name' },
    { label: 'Status', fieldName: 'CEMS_Interview_Status__c' },
    { label: 'Panel', fieldName: 'CEMS_Interview_Panel__r.Name' },
    { label: 'Round', fieldName: 'CEMS_Interview_Round__c' },
    { label: 'Feedback Submitted', fieldName: 'CEMS_IsFeedbackSubmitted__c', type: 'boolean',
    cellAttributes: {
      iconName: { fieldName: 'feedbackIcon' },
      iconAlternativeText: { fieldName: 'feedbackText' }
    }
    
    },
    
];

export default class CEMSSchedulerTable extends LightningElement {
 
  @track columns = columns;
    @track contactRow;
    @track rowOffset = 0;
    @track recordList;
    @track modalContainer = false;
    @track displayModelRow;
    @track recordid;
    //@wire(getDataFromContact) wireContact;
    selectedRound = '';
    picklistValues; // Add roundOptions property
    showFormInParent = true;
    selectedDateTime;
    interviewData;
    interviewData1;
   @api email;
//
   @api isFeedbackSubmitted = false;
   @api displayModelRow;
   @api recordid;
   shouldDisplayFeedback2;
   shouldDisplayFeedback1 = false;
   shouldDisplayFeedback = false;
   pageSize = 6;
   @track currentPage = 1;
   totalRecords=0;
   showPagination = false;

   //

    originalColumns = [...this.columns]; // Store original columns for reference
    @wire(getPicklistValues, { recordTypeId: '012DO0000008XetYAE', fieldApiName: Round_Field })
    loadPicklistValues({ data, error }) {
        if (data) {
            console.log('interview email inside ' + this.email);
            this.picklistValues = data.values;
            console.log(this.picklistValues);
        } else if (error) {
            // Handle error if necessary
            console.error('Error loading picklist values:', error);
        }
    }
   
    originalData = [];
    @wire(getDataFromContact2, { loginEmail: '$email' })
    wiredResult({ error, data }) {
        if (data) {
          console.log('inside wire ' + this.loggedinemail);
          this.originalData = [...data];
        this.interviewData1 = this.formatData(data);
               
        
        this.interviewData1 = data.map(record => {
          if (record.CEMS_Interview_Panel__r) {
              return Object.assign(
                  { "CEMS_Interview_Panel__r.Name": record.CEMS_Interview_Panel__r.Name },
                  record
              );
          }
          return record;
      });
   
          console.log('data',JSON.stringify(data));
            // Handle the response data
        } else if (error) {
            // Handle the error
            console.log('error',JSON.stringify(error));

        }
    }
  
   
    @wire(getDataFromContact2, { loginEmail: '$email' })
    wiredResult({ error, data }) {
        if (data) {
        const formattedData = this.formatData(data);
        this.originalData = [...formattedData]; // Assign the original data
        this.interviewData1 = formattedData.map(record => {
          if (record.CEMS_Interview_Panel__r) {
              return Object.assign(
                  { "CEMS_Interview_Panel__r.Name": record.CEMS_Interview_Panel__r.Name },
                  record
              );
          }
          return record;
      });
  

          console.log('data',JSON.stringify(data));
            // Handle the response data
            this.totalRecords = data.length;
            this.interviewData1 = this.interviewData1.slice(0, this.pageSize);
            this.showPagination = this.totalRecords > this.pageSize;

        } else if (error) {
            // Handle the error
            console.log('error',JSON.stringify(error));

        }
    }

    
    formatData(data) {
      return data.map(record => {
          let formattedDateTime = '';
          if (record.CEMS_Interview_Start_Time__c) {
              const dateTime = new Date(record.CEMS_Interview_Start_Time__c);
              if (!isNaN(dateTime)) {
                const day = dateTime.getDate().toString().padStart(2, '0');
                const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
                const year = dateTime.getFullYear();
                const hours = dateTime.getHours();
                const minutes = dateTime.getMinutes().toString().padStart(2, '0');
                const ampm = hours >= 12 ? 'PM' : 'AM';
                const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
                formattedDateTime = `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
              }
          }
          let feedbackIcon = '';
          let feedbackText = '';
          if (record.CEMS_IsFeedbackSubmitted__c === false) {
              feedbackIcon = 'utility:close';
              feedbackText = 'Feedback Not Submitted';
          }
          return {
              ...record,
              formattedDateTime,
              feedbackIcon,
              feedbackText
          };
      });
  }
  
      handlePagination(event) {
        const pageNumber = event.detail;
        this.currentPage = pageNumber;
        const start = (pageNumber - 1) * this.pageSize;
        const end = pageNumber * this.pageSize;
        this.interviewData1 = this.originalData.slice(start, end);
      }
    
      handleRowAction1(event) {
        const recordId = event.target.dataset.recordId; // Retrieve the record ID from the dataset
        // Perform any actions or logic you want when the "Feedback" button is clicked for a specific row
        console.log('Feedback clicked for record with ID:', recordId);
        this.recordid = recordId; // Assign the record ID to the component property
        this.displayModelRow = this.interviewData1.find(item => item.Id === recordId); // Find the record in the interviewData1 array
        this.modalContainer = true;
      
}

    handleRowAction(event) {
        // const dataRow = event.detail.row;
        // console.log('dataRow@@ ' + JSON.stringify(dataRow));
        // this.displayModelRow = dataRow;
        // console.log('contactRow## ' + JSON.stringify(dataRow));
        // this.modalContainer = true;
        const dataRow = event.detail.row;
        this.recordid = event.detail.row.Id; // Retrieve the record ID
        console.log('dataRow@@ :' + JSON.stringify(dataRow));
        console.log('recordId@@ :' + this.recordid);
        this.displayModelRow = dataRow;
        console.log('contactRow## ' + JSON.stringify(dataRow));
        this.gethandlerow();
        this.modalContainer = true;
            
    }
gethandlerow(){
    if(this.displayModelRow.CEMS_IsFeedbackSubmitted__c === false){
      this.shouldDisplayFeedback =true;
      this.shouldDisplayFeedback1 = false;

    }
    if(this.displayModelRow.CEMS_IsFeedbackSubmitted__c === true){
      this.shouldDisplayFeedback1 = true;
      this.shouldDisplayFeedback =false;

    }}

    closeModalAction() {
        this.modalContainer = false;
        // console.log("hello:" + this.contactRow);
        // setTimeout(() => {
        //     eval("$A.get('e.force:refreshView').fire();");
        // }, 1000);

    }
    

   

    handleScheduleInterview() {
        // Logic to handle the "Schedule Interview" event
        this.showFormInParent = false;

    }

    handleOpenScheduleInterview() {
        // Logic to handle the "Schedule Interview" event
        this.showFormInParent = true;

    }
    handleRoundChange(event) {
        this.selectedRound = event.detail.value;
        this.filterDataByRound();
    }
    
    handleDateTimeChange(event) {
        this.selectedDateTime = event.target.value;
        this.filterDataByDateTime();
    }


    filterDataByRound() {
        if (this.selectedRound) {
            const filteredData = this.originalData.filter(record =>
                record.CEMS_Interview_Round__c === this.selectedRound
            );
            this.interviewData1 = filteredData.map(record => {
                if (record.CEMS_Interview_Panel__r) {
                    return Object.assign(
                        { "CEMS_Interview_Panel__r.Name": record.CEMS_Interview_Panel__r.Name },
                        record
                    );
                }
                return record;
            });
        } else {
            // No round selected, display all records
            this.interviewData1 = this.originalData.map(record => {
                if (record.CEMS_Interview_Panel__r) {
                    return Object.assign(
                        { "CEMS_Interview_Panel__r.Name": record.CEMS_Interview_Panel__r.Name },
                        record
                    );
                }
                return record;
            });
        }
        this.columns = this.originalColumns; // Reset columns to original state
    }

    handleResetFilter() {
      if (!this.selectedRound && !this.selectedDateTime) {
        this.template.querySelector("c-custom-toast-messages").showToast("warning", "Please select a Round or Date to apply the filter.");
        const event = new ShowToastEvent({
            message: 'Please select a Round or Date to apply the filter.',
            variant: 'warning'
        });
        this.dispatchEvent(event);
    } else{
        this.interviewData1 = this.originalData.map(record => {
            if (record.CEMS_Interview_Panel__r) {
                return Object.assign(
                    { "CEMS_Interview_Panel__r.Name": record.CEMS_Interview_Panel__r.Name },
                    record
                );
            }
            return record;
        });
        this.columns = this.originalColumns;

        let interviewRound = this.template.querySelector('lightning-combobox[data-id="resetPicklist"]');
        interviewRound.value = '';

        let interviewDate = this.template.querySelector('lightning-input[data-id="resetPicklist"]');
        interviewDate.value = '';
        this.selectedRound = '';
        this.selectedDateTime = '';
    }
  }
    
    filterDataByDateTime() {
        if (this.selectedDateTime) {
            const selectedDate = new Date(this.selectedDateTime).toDateString();
            const filteredData = this.originalData.filter(record =>
                new Date(record.CEMS_Interview_Start_Time__c).toDateString() === selectedDate
            );
            this.interviewData1 = filteredData.map(record => {
                if (record.CEMS_Interview_Panel__r) {
                    return Object.assign(
                        { "CEMS_Interview_Panel__r.Name": record.CEMS_Interview_Panel__r.Name },
                        record
                    );
                }
                return record;
            });
        } else {
            // No date/time selected, display all records
            this.interviewData1 = this.originalData.map(record => {
                if (record.CEMS_Interview_Panel__r) {
                    return Object.assign(
                        { "CEMS_Interview_Panel__r.Name": record.CEMS_Interview_Panel__r.Name },
                        record
                    );
                }
                return record;
            });
        }


    }
   
     shouldDisplayFeedback() {
      if(this.displayModelRow.CEMS_IsFeedbackSubmitted__c === false){
      return false;}
            
      }
       shouldDisplayFeedback1() {
        if(this.displayModelRow.CEMS_IsFeedbackSubmitted__c === true){
        return true ;}

        
      }
        
      
      handleDateTimeChange(event) {
        this.selectedDateTime = event.target.value;
        this.filterData();
      }
      
      handleRoundChange(event) {
        this.selectedRound = event.target.value;
        this.filterData();
      }

      filterData() {
        if (this.selectedRound && this.selectedDateTime) {
          // Filter by both round and date/time
          const selectedDate = new Date(this.selectedDateTime).toDateString();
          const filteredData = this.originalData.filter(record =>
            record.CEMS_Interview_Round__c === this.selectedRound &&
            new Date(record.CEMS_Interview_Start_Time__c).toDateString() === selectedDate
          );
          this.interviewData1 = filteredData.map(record => {
            if (record.CEMS_Interview_Panel__r) {
              return Object.assign(
                { "CEMS_Interview_Panel__r.Name": record.CEMS_Interview_Panel__r.Name },
                record
              );
            }
            return record;
          });
        } else if (this.selectedRound) {
          // Filter by round only
          const filteredData = this.originalData.filter(record =>
            record.CEMS_Interview_Round__c === this.selectedRound
          );
          this.interviewData1 = filteredData.map(record => {
            if (record.CEMS_Interview_Panel__r) {
              return Object.assign(
                { "CEMS_Interview_Panel__r.Name": record.CEMS_Interview_Panel__r.Name },
                record
              );
            }
            return record;
          });
        } else if (this.selectedDateTime) {
          // Filter by date/time only
          const selectedDate = new Date(this.selectedDateTime).toDateString();
          const filteredData = this.originalData.filter(record =>
            new Date(record.CEMS_Interview_Start_Time__c).toDateString() === selectedDate
          );
          this.interviewData1 = filteredData.map(record => {
            if (record.CEMS_Interview_Panel__r) {
              return Object.assign(
                { "CEMS_Interview_Panel__r.Name": record.CEMS_Interview_Panel__r.Name },
                record
              );
            }
            return record;
          });
        } else {
          // No round or date/time selected, display all records
          this.interviewData1 = this.originalData.map(record => {
            if (record.CEMS_Interview_Panel__r) {
              return Object.assign(
                { "CEMS_Interview_Panel__r.Name": record.CEMS_Interview_Panel__r.Name },
                record
              );
            }
            return record;
          });
        }
      
        this.columns = this.originalColumns; // Reset columns to original state
      }

      showFeedback = true; // Property to control the visibility of the feedback section
      shouldDisplayFeedback = true; // Property to control the visibility of the feedback section
      
      
}