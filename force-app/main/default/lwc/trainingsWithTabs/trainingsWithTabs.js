import { LightningElement, track,api } from 'lwc';
export default class TrainingsWithTabs extends LightningElement {
 @api email;
 //@track value = 'salesforceLwcField';
    @track activeTabValue = 'My Trainings'; // Set the default active tab value

    // get options() {
    //     return [
    //         { label: 'My Trainings', value: 'My Trainings' },
    //         { label: 'All The Employees Trainings', value: 'All The Employees Trainings' },
                 
    //     ];
    // }
    // @track salesforceLwcFieldValue = true;
    // @track tutorialFieldValue = false;
    // connectedCallback() {
    //     // Automatically select the first tab when the component loads
    //     this.handleRadioChange({ detail: { value: this.value } });
    // }
    
 
    // handleRadioChange(event) {
    //     this.value = event.detail.value;
    //     const selectedOption = event.detail.value;
    //     //alert('selectedOption ' + selectedOption);
    //     if (selectedOption == 'My Trainings'){
    //         this.salesforceLwcFieldValue = true;
    //     }
    //     else{
    //         this.salesforceLwcFieldValue = false;
    //     }
 
    //     if (selectedOption == 'All The Employees Trainings'){
    //         this.tutorialFieldValue = true;
    //     }else{
    //         this.tutorialFieldValue = false;
    //     }
        
 
     
    // }
    }