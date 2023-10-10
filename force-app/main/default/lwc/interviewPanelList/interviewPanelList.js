/*
import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
//import {getListUi} from 'lightning/uiListApi'
//import { updateRecord  } from 'lightning/uiRecordApi';
import getInterviewPanels from '@salesforce/apex/InterviewPanelController.getInterviewPanels';
//import PANEL_OBJECT from '@salesforce/schema/CEMS_Interview_Panel__c';
/*
const COLS =[
    {label:'Id', fieldName:'Id'},
    {label:'Name', fieldName:'Name'},
    {label:'Interviewer1', fieldName:'CEMS_Interviewer_1__c', editable:true},
    {label:'Interviewer2', fieldName:'CEMS_Interviewer_2__c', editable:true},
    {label:'Interviewer3', fieldName:'CEMS_Interviewer_3__c',  editable:true}
]*/

//export default class InterviewPanelList extends NavigationMixin(LightningElement) {
    /*
    interviewers=[]
    columns = COLS
    draftValues=[]
    @wire(getListUi, {
        objectApiName:PANEL_OBJECT,
        listViewApiName:'AllPanels'
    })listViewHandler({data, error}){
        if(data){
            console.log(data)
            this.interviewers = data.records.records.map(item=>{
                return {
                    "Id": this.getValue(item, 'Id'),
                    "Name": this.getValue(item, 'Name'),
                    "Interviewer1": this.getValue(item, 'CEMS_Interviewer_1__c'),
                    "Interviewer2": this.getValue(item, 'CEMS_Interviewer_2__c'),
                    "Interviewer3": this.getValue(item, 'CEMS_Interviewer_3__c')
                }
            })
        }
        if(error){
            console.error(error)
        }
    }
    getValue(data, field){
        return data.fields[field].value
    }
  
  
    handleSave(event){
        console.log(JSON.stringify(event.detail.draftValues))
        const recordInputs=event.detail.draftValues.map(draft=>{
            const fields = {...draft};
            return { fields:fields };
        })
        const promises = recordInputs.map(recordInput=>updateRecord(recordInput))
        Promise.all(promises).then(()=>{
            console.log('Panel updated Successfully')
            this.draftValues=[]
        }).catch(error=>{
            console.error("Error updating the record", error)
        })
        
    }*/
    

/*
    interviewPanels = []; // Declare an empty array

    connectedCallback() {
        this.retrieveInterviewPanels();
    }

    retrieveInterviewPanels() {
        getInterviewPanels()
            .then((result) => {
                if (result.data) {
                    this.interviewPanels = result.data.map(panel => ({
                        ...panel,
                        interviewer1Name: panel.CEMS_Interviewer_1__r.Name,
                        interviewer2Name: panel.CEMS_Interviewer_2__r.Name,
                        interviewer3Name: panel.CEMS_Interviewer_3__r.Name,
                    }));
                    console.log('Interview Panels:', this.interviewPanels);
                } else if (result.error) {
                    console.error('Error:', result.error);
                    this.interviewPanels = undefined; // Set interviewPanels to undefined in case of an error
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                this.interviewPanels = undefined; // Set interviewPanels to undefined in case of an error
            });
    }

    get columns() {
        return [
            { label: 'Name', fieldName: 'Name', type: 'text' },
            { label: 'Interviewer 1', fieldName: 'interviewer1Name', type: 'text' },
            { label: 'Interviewer 2', fieldName: 'interviewer2Name', type: 'text' },
            { label: 'Interviewer 3', fieldName: 'interviewer3Name', type: 'text' },
            { label: 'Position Name', fieldName: 'CEMS_Position_Name__c', type: 'text',
                cellAttributes: { fieldName: 'CEMS_Position_Name__r.Name' } },
        ];
    }
}*/

/*
import { LightningElement, track } from 'lwc';
import getAllInterviewPanels from '@salesforce/apex/InterviewPanelController.getAllInterviewPanels';
import updateInterviewPanel from '@salesforce/apex/InterviewPanelController.updateInterviewPanel';

export default class InterviewPanelList extends LightningElement {
    @track interviewPanels;
    @track showEditForm = false;
    @track editedPanel = {
        Id: '',
        CEMS_Interviewer_1__c: '',
        CEMS_Interviewer_2__c: '',
        CEMS_Interviewer_3__c: ''
    };

    connectedCallback() {
        this.fetchInterviewPanels();
    }

    fetchInterviewPanels() {
        getAllInterviewPanels()
            .then(result => {
                this.interviewPanels = result;
            })
            .catch(error => {
                console.error('Error fetching interview panels:', error);
            });
    }

    handleEditClick(event) {
        const panelId = event.target.value;
        const panel = this.interviewPanels.find(item => item.Id === panelId);

        if (panel) {
            this.editedPanel = {
                Id: panel.Id,
                CEMS_Interviewer_1__c: panel.CEMS_Interviewer_1__c,
                CEMS_Interviewer_2__c: panel.CEMS_Interviewer_2__c,
                CEMS_Interviewer_3__c: panel.CEMS_Interviewer_3__c
            };
            this.showEditForm = true;
        }
    }

    handleInputChange(event) {
        const fieldName = event.target.label;
        const value = event.target.value;

        this.editedPanel = { ...this.editedPanel, [fieldName]: value };
    }

    handleSaveClick() {
        updateInterviewPanel({ panel: this.editedPanel })
            .then(() => {
                this.showEditForm = false;
                this.fetchInterviewPanels();
            })
            .catch(error => {
                console.error('Error updating interview panel:', error);
            });
    }

    handleCancelClick() {
        this.showEditForm = false;
    }
}

*/

import { LightningElement, wire, track, api } from 'lwc';
import getInterviewPanels from '@salesforce/apex/InterviewPanelController.getInterviewPanels';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';

const columns = [
    {
        label: 'Edit',
        type: 'button-icon',
        initialWidth: 75,
        typeAttributes: {
          iconName: 'action:edit',
          title: 'Preview',
          variant: 'border-filled',
          alternativeText: 'Edit',
          recordId: { fieldName: 'Id' }
        }
      },
    { label: 'Panel Name', fieldName: 'Name', type: 'text' },
    { label: 'Position Name', fieldName: 'CEMS_Position_Name__r.Name' },
    { label: 'Interviewer 1', fieldName: 'CEMS_Interviewer_1__r.Name' },
    { label: 'Interviewer 2', fieldName: 'CEMS_Interviewer_2__r.Name' },
    { label: 'Interviewer 3', fieldName: 'CEMS_Interviewer_3__r.Name'},
   
];

export default class InterviewPanelList extends LightningElement {
    @track modalContainer = false;
      //@track recordid ;
      @track displayModelRow;
      @track isEditing = false;
      @track recordid;
    interviewPanels;

    
    
    @wire(getInterviewPanels)
    wiredInterviewPanels({ error, data }) {
        if (data) {
            this.interviewPanels = data;
            this.interviewPanels = data.map(record => {
                if (record.CEMS_Position_Name__r) {
                    record = Object.assign(
                        { "CEMS_Position_Name__r.Name": record.CEMS_Position_Name__r.Name },
                        record
                    );
                }
                if (record.CEMS_Interviewer_1__r) {
                    record = Object.assign(
                        { "CEMS_Interviewer_1__r.Name": record.CEMS_Interviewer_1__r.Name },
                        record
                    );
                }
    
                if (record.CEMS_Interviewer_2__r) {
                    record = Object.assign(
                        { "CEMS_Interviewer_2__r.Name": record.CEMS_Interviewer_2__r.Name },
                        record
                    );
                }

                if (record.CEMS_Interviewer_3__r) {
                    record = Object.assign(
                        { "CEMS_Interviewer_3__r.Name": record.CEMS_Interviewer_3__r.Name },
                        record
                    );
                }

              
    
                return record;
            });
        } else if (error) {
            console.error(error);
        }
    }

    get columns() {
        return columns;
    }
    closeModalAction() {
        console.log('**** inside');
        this.modalContainer = false;
        this.isPanelOpen = false;

    }
    handleRowAction(event) {
        const dataRow = event.detail.row;
        this.recordid = event.detail.row.Id; // Retrieve the record ID
        console.log('dataRow@@ :' + JSON.stringify(dataRow));
        console.log('recordId@@ :' + this.recordid);
        this.displayModelRow = dataRow;
        console.log('Row## ' + JSON.stringify(dataRow));
        this.closePanel();
        this.modalContainer = true;
        
       
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(dataRow);
            }, 500); // Set a 2-second delay before resolving the Promise
        });
    }
    @track modalContainer1 = false;
    
 
   
  
    openPanels() {
      // Code to open the panels
      this.modalContainer1 = true;
      this.modalContainer = false;
      
    }
    // connectedCallback() {
    //     // Automatically open the panel when the component is loaded
    //     this.openPanels();
    //   }
    closePanel() {
        this.modalContainer1 = false;
      }
    
      handleClose(){
        this.modalContainer1 = false;
      }

      @track isPanelOpen = true; // Property to control panel visibility

      handleChildClosePanel() {
        this.isPanelOpen = false;  // Close the panel by setting the property to false
        this.openPanels();
        setTimeout(() => {
            this.isPanelOpen = true; // Open the panel again after a delay
        }, 0);
    }
    
     
/*
    handleSave(event) {
        this.closeModalAction();

    event.preventDefault();

console.log('kjs');
const fields = event.detail.fields;
    console.log('fields',fields);

 const recordId = this.displayModelRow.Id;
        console.log('recordId',recordId);


 // Set the record Id for update
fields.Id = recordId;

 // Update the record using lightning/uiRecordApi
 updateRecord(fields.Id)
   .then(() => {
     // Record is saved successfully, perform any additional actions if needed
     this.showToast('Success', 'Record saved successfully.', 'success');
     this.closeModalAction();
   })
   .catch((error) => {
     // Handle any error occurred during record update
     this.showToast('Error', 'An error occurred while saving the record.', 'error');
     console.error('Error saving record:', error);
   });
}



// Helper method to show toast messages
showToast(title, message, variant) {
 const toastEvent = new ShowToastEvent({
   title: title,
   message: message,
   variant: variant,
 });
 this.dispatchEvent(toastEvent);
}

closeModalAction() {
this.modalContainer = false;
}
handleRowAction(event) {
    const action = event.detail.action;
    const dataRow = event.detail.row;
    console.log('dataRow@@ :' + JSON.stringify(dataRow));
    
    this.recordId = event.detail.row.Id;
    console.log('recordId@@ :' + this.recordId);
    this.displayModelRow = dataRow;
    this.modalContainer = true;
    console.log('contactRow## ' + JSON.stringify(dataRow));
    this.modalContainer = true;
    if (action.name === 'edit') {
        this.displayModelRow = dataRow;
        
      }*/

  }