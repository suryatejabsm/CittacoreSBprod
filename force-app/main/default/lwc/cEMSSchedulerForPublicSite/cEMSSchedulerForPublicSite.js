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
    handleRoundChange(event) {
        this.selectedRound = event.detail.value;
        this.filterDataByRound();
    }

    filterDataByRound() {

    }

    handleDateTimeChange(event) {
        this.selectedDateTime = event.target.value;
        this.filterDataByDateTime();
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

}