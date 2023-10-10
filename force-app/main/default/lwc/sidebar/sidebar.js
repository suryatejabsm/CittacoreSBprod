import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class Sidebar extends NavigationMixin(LightningElement) {

    @track currentContent = 'cittacore';
    @track cittacoreValue = false;
    @track jobopeningsValue = false;
    @track jobapplicationsValue = false;
    @track prescreening2 = false;
    @track interviewscheduleValue = false;
    @track dashboardValue = false;
    @track salesforceLwcValue = false;
    @track height = '900px';
    @track referrerPolicy = 'no-referrer';
    @track sandbox = '';
    @track url = 'https://cittacoretechnologiesinc3--ems.sandbox.lightning.force.com/lightning/r/Dashboard/01ZDO0000000DCZ2A2/';
    @track width = '100%';

    // connectedCallback() {
    //     console.log('*** url = ' + this.url);
    // }
   renderedCallback() {
      
        if (!this.currentContent) {
            // Set the first item as the current content
            const firstItem = this.template.querySelector('lightning-vertical-navigation-item');
            if (firstItem) {
                this.currentContent = firstItem.name;
                this.changeHandleAction({ detail: { name: this.currentContent } });
            }
        }
    }
    handleNavigate(evt) {

        const reportId = event.detail.recordId;

        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: reportId,
                objectApiName: 'Report',
                actionName: 'view'
            }

        });
    }
    changeHandleAction(event) {
        const selected = event.detail.name;

        this.currentContent = selected;


        if (selected == 'cittacore') {
            this.cittacoreValue = true;
        } else {
            this.cittacoreValue = false;
        }

        if (selected == 'jobopenings') {
            this.jobopeningsValue = true;
        } else {
            this.jobopeningsValue = false;
        }

        if (selected == 'jobapplications') {
            this.jobapplicationsValue = true;
        } else {
            this.jobapplicationsValue = false;
        }
        if (selected == 'Pre Screening') {
            this.Prescreening2 = true;
        } else {
            this.Prescreening2 = false;
        }

        if (selected == 'interviewschedule') {
            this.interviewscheduleValue = true;
        } else {
            this.interviewscheduleValue = false;
        }

        if (selected == 'dashboard') {
            this.dashboardValue = true;
        } else {
            this.dashboardValue = false;
        }

        if (selected == 'salesforceLwc') {
            this.salesforceLwcValue = true;
        } else {
            this.salesforceLwcValue = false;
        }

    }
}