import { LightningElement, track,api } from 'lwc';
export default class AwardsWithTabs extends LightningElement {
    @api email;
    // get options() {
    //     return [
    //         { label: 'My Awards', value: 'My Awards' },
    //         { label: 'All The Employees Awards', value: 'All The Employees Awards' },
                 
    //     ];
    // }
    // @track salesforceLwcFieldValue = true;
    // @track tutorialFieldValue = false;
    @track activeTabValue = 'My Awards'; // Set the default active tab value
    

    // handleRadioChange(event) {
    //     const selectedOption = event.detail.value;
    //     //alert('selectedOption ' + selectedOption);
    //     if (selectedOption == 'My Awards'){
    //         this.salesforceLwcFieldValue = true;
    //     }
    //     else{
    //         this.salesforceLwcFieldValue = false;
    //     }
 
    //     if (selectedOption == 'All The Employees Awards'){
    //         this.tutorialFieldValue = true;
    //     }else{
    //         this.tutorialFieldValue = false;
    //     }

    // }
    }