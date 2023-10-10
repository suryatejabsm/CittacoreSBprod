import { LightningElement, track } from 'lwc';
export default class PublicSite extends LightningElement {

    @track timeout = 3000;
    @track sticky = false;

    emailValue;
    @track showHome = true;
    @track showAbout = false;
    @track showServices = false;

    handleNavigationSelect(event) {
        const selectedMenuItem = event.detail.name;

        // Show/hide content based on the selected menu item
        this.showHome = selectedMenuItem === 'home';
        this.showAbout = selectedMenuItem === 'about';
        this.showServices = selectedMenuItem === 'services';
    }
    handleEmailChange(event) {
        this.emailValue = event.detail.email;
        console.log(emailValue);
    }

    toggleMobileMenu(event) {
        const evt = event.currentTarget;
        evt.classList.toggle("open");
    }


}