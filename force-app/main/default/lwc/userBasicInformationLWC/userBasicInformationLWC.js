import { LightningElement, wire, api } from 'lwc';
import getUserBasicInformation from '@salesforce/apex/UserBasicInformationRestResource.getUserBasicDetail';

export default class UserBasicInformationLWC extends LightningElement {
    @api userEmailId;
    @wire(getUserBasicInformation, { userEmailId: '$userEmailId' })
    userData;

    handleButtonClick() {
        // Call this method to retrieve the user information
        this.getUserInformation();
    }

    getUserInformation() {
        this.userEmailId = 'naguruks@cittacore.com'; // Replace with the email ID you want to search
    }

    get isDataAvailable() {
        return this.userData && !this.userData.error;
    }

    get errorMessage() {
        return this.userData && this.userData.error ? this.userData.error.message : '';
    }

    get userInformation() {
        return this.userData && this.userData.data ? this.userData.data : {};
    }
}