import { LightningElement, track,api } from 'lwc';
export default class PerformanceWithTabs extends LightningElement {
    @api email;
    get options() {
        return [
            { label: 'My Performance', value: 'My Performance' },
            { label: 'All The Employees Performance', value: 'All The Employees Performance' },
                 
        ];
    }
    @track salesforceLwcFieldValue = true;
    @track tutorialFieldValue = false;

    handleRadioChange(event) {
        const selectedOption = event.detail.value;
        //alert('selectedOption ' + selectedOption);
        if (selectedOption == 'My Performance'){
            this.salesforceLwcFieldValue = true;
        }
        else{
            this.salesforceLwcFieldValue = false;
        }
 
        if (selectedOption == 'All The Employees Performance'){
            this.tutorialFieldValue = true;
        }else{
            this.tutorialFieldValue = false;
        }

    }
    }