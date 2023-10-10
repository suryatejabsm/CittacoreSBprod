import { LightningElement,track } from 'lwc';
import getDashboardUrl from '@salesforce/apex/DashboardController.getDashboardUrl';

export default class GetDashboardUrl extends LightningElement {
 @track dashboardUrl;

    connectedCallback() {
        this.dashboardUrl = '/lightning/r/Dashboard/01ZDO0000000DCZ2A2/view';
    }
    
}