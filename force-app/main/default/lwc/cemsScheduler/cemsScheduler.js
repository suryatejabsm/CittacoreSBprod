import { LightningElement, track, wire, api } from 'lwc';
import getDataFromContact from '@salesforce/apex/CEMSSchedulerController.getInterviewData';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import Round_Field from '@salesforce/schema/CEMS_Internal_Scheduler__c.CEMS_Interview_Round__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const PAGE_SIZE = 6;
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
    
    { label: 'Date', fieldName: 'formattedDateTime' },
    { label: 'Applicant', fieldName: 'Name' },
    { label: 'Status', fieldName: 'CEMS_Interview_Status__c' },
    { label: 'Panel', fieldName: 'CEMS_Interview_Panel__r.Name' },
    { label: 'Round', fieldName: 'CEMS_Interview_Round__c' }
];

export default class CEMSSchedulerTable extends LightningElement {
    @track columns = columns;
    @track contactRow;
    @track rowOffset = 0;
    @track recordList;
    @track modalContainer = false;
    @track modalContainer1 = false;
 
    @track displayModelRow;
    //@track recordid;
    //@wire(getDataFromContact) wireContact;
    selectedRound = '';
    picklistValues; // Add roundOptions property
    showFormInParent = true;
    selectedDateTime;
    interviewData;
    @track recordid;
    @track currentPage = 1;
    @track totalRecords = 0;
    @track disablePrevious = true;
    @track disableNext = false;
    

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
    // @wire(getDataFromContact)
    // wiredInterviewData({ error, data }) {
    //     if (data) {
    //         this.originalData = [...data]; // Assign the original data
    //         this.interviewData = this.formatData(data);
    //         this.totalRecords = data.length;
    //         this.updateInterviewData();
    //         this.interviewData = data.map(record => {
    //             if (record.CEMS_Interview_Panel__r) {
    //                 return Object.assign(
    //                     { "CEMS_Interview_Panel__r.Name": record.CEMS_Interview_Panel__r.Name },
    //                     record
    //                 );
    //             }
    //             return record;
    //         });
    //         console.log(JSON.stringify(this.interviewData));
         
    //     } else if (error) {
    //         // Handle error if needed
    //     }
    // }
    // Call the new method in the connectedCallback to fetch the data when the component is loaded
    connectedCallback() {
      this.fetchInterviewData();
  }
  handleInterviewSaved() {
    // Refresh the interview data without refreshing the whole page
    this.fetchInterviewData();
}

      // Add a new method to fetch interview data using .then and .catch
      fetchInterviewData() {
        getDataFromContact()
            .then((data) => {
                this.originalData = [...data];
                const formattedData = this.formatData(data);
                this.originalData = [...formattedData];
                this.totalRecords = data.length;
                this.interviewData = formattedData.map(record => {
                    if (record.CEMS_Interview_Panel__r) {
                        return Object.assign(
                            { "CEMS_Interview_Panel__r.Name": record.CEMS_Interview_Panel__r.Name },
                            record
                        );
                    }
                    return record;
                });
                this.updateInterviewData();
                console.log(JSON.stringify(this.interviewData));
            })
            .catch((error) => {
                // Handle error if needed
            });
    }
 
    // @wire(getDataFromContact)
    // wiredInterviewData({ error, data }) {
    //   if (data) {
    //     this.originalData = [...data]; // Assign the original data
    //     const formattedData = this.formatData(data);
    //     this.originalData = [...formattedData]; // Assign the original data
    //     this.totalRecords = data.length;
    //     this.interviewData = formattedData.map(record => {
    //       if (record.CEMS_Interview_Panel__r) {
    //         return Object.assign(
    //           { "CEMS_Interview_Panel__r.Name": record.CEMS_Interview_Panel__r.Name },
    //           record
    //         );
    //       }
    //       return record;
    //     });
    //     this.updateInterviewData();
    //     console.log(JSON.stringify(this.interviewData));
       
    //   } else if (error) {
    //     // Handle error if needed
    //   }
      
    // }

    updateInterviewData() {
      const startIndex = (this.currentPage - 1) * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;
      this.interviewData = this.originalData
        .slice(startIndex, endIndex)
        .map(record => {
          if (record.CEMS_Interview_Panel__r) {
            return Object.assign(
              { "CEMS_Interview_Panel__r.Name": record.CEMS_Interview_Panel__r.Name },
              record
            );
          }
          return record;
        });
      this.disablePrevious = this.currentPage === 1;
      this.disableNext = this.currentPage * PAGE_SIZE >= this.totalRecords;
    }
   // Create a timer variable for debouncing
   searchTimer;

   handleSearch(event) {
       const searchTerm = event.target.value.toLowerCase();

       // Clear the previous timer to reset the delay
       clearTimeout(this.searchTimer);

       // Set a new timer for the search functionality
       this.searchTimer = setTimeout(() => {
           if (searchTerm) {
               // Filter data based on the candidate name
               this.interviewData = this.originalData.filter(record =>
                   record.Name.toLowerCase().includes(searchTerm)
               ).map(record => {
                   if (record.CEMS_Interview_Panel__r) {
                       return Object.assign(
                           { "CEMS_Interview_Panel__r.Name": record.CEMS_Interview_Panel__r.Name },
                           record
                       );
                   }
                   return record;
               });
           } else {
               // When search input is empty, show only 6 records per page
               this.updateInterviewData();
           }
       }, 400); // 400ms delay (adjust this value as needed)
   }

  

  handlePreviousPage() {
    // Handle clicking "Previous" when already on the first page
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateInterviewData();
      this.disableNext = false; // Enable "Next" button
    }
    this.disablePrevious = this.currentPage === 1; // Disable "Previous" button if on the first page
  }

  handleNextPage() {
    // Handle clicking "Next" when already on the last page
    if (this.currentPage * PAGE_SIZE < this.totalRecords) {
      this.currentPage++;
      this.updateInterviewData();
      this.disablePrevious = false; // Enable "Previous" button
    }
    this.disableNext = this.currentPage * PAGE_SIZE >= this.totalRecords; // Disable "Next" button if on the last page
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
          return {
            ...record,
            formattedDateTime
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
        console.log('recordId@@ :' + this.recordId);
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
    handleRoundChange(event) {
        this.selectedRound = event.detail.value;
        this.filterDataByRound();
    }

    

    handleDateTimeChange(event) {
        this.selectedDateTime = event.target.value;
        this.filterDataByDateTime();
    }

    handleScheduleInterview() {
        // Logic to handle the "Schedule Interview" event
        this.showFormInParent = false;

    }

    // handleOpenScheduleInterview() {
    //     // Logic to handle the "Schedule Interview" event
    //     this.showFormInParent = true;

    // }
    handleRoundChange(event) {
        this.selectedRound = event.detail.value;
        this.filterDataByRound();
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
      if (!this.selectedRound && !this.selectedDateTime) {
          const event = new ShowToastEvent({
              message: 'Please select a Round or Date to apply the filter.',
              variant: 'warning'
          });
          this.dispatchEvent(event);
      } else {
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
  
          this.selectedRound = '';
          this.selectedDateTime = '';
          this.currentPage = 1; // Reset to the first page after filtering
          this.updateInterviewData();
          
      }
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
    //@api recordid;
    get shouldDisplayFeedback() {
        return this.displayModelRow.CEMS_Interview_Status__c === 'Completed';
      }
      
    //@api recordid;
    get editInterview() {
      const interviewStatus = this.displayModelRow.CEMS_Interview_Status__c;
      return (
        interviewStatus === 'Accepted' ||
        interviewStatus === 'Rescheduled' ||
        interviewStatus === 'OnHold' ||
        interviewStatus === 'In Progress'
      );
    }
/*
    get editInterviewPanel() {
      const interviewStatus = this.displayModelRow.CEMS_Interview_Status__c;
      return (
        interviewStatus === 'Accepted' ||
        interviewStatus === 'Rescheduled' ||
        interviewStatus === 'OnHold' ||
        interviewStatus === 'In Progress'
      );
    }*/
     
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