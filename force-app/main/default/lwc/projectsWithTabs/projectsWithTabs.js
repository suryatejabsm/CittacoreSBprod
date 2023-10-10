import { LightningElement, track,api } from 'lwc';
export default class ProjectsWithTabs extends LightningElement {
    @api email;
    get options() {
        return [
            { label: 'My Projects', value: 'My Projects' },
            { label: 'All The Employees Projects', value: 'All The Employees Projects' },
                 
        ];
    }
    @track salesforceLwcFieldValue = true;
    @track tutorialFieldValue = false;

    handleRadioChange(event) {
        const selectedOption = event.detail.value;
        //alert('selectedOption ' + selectedOption);
        if (selectedOption == 'My Projects'){
            this.salesforceLwcFieldValue = true;
        }
        else{
            this.salesforceLwcFieldValue = false;
        }
 
        if (selectedOption == 'All The Employees Projects'){
            this.tutorialFieldValue = true;
        }else{
            this.tutorialFieldValue = false;
        }

    }
    }