import { LightningElement, track, api } from 'lwc';
export default class PublicSiteSidebar extends LightningElement {
    @api email;
    @api isloggedafter;
    @track currentContent = 'Home';
    @track homeValue = false;
    @track personalDetailsValue = false;
    @track myProjectsValue = false;
    @track myPerformanceValue = false;
    @track leavesValue = false;
    @track jobOpeningsValue = false;
    @track awardValue = false;
    @track interviewSheduleValue = false;
    @track resignationValue = false;
    @track isNavigationVisible = true;
    @track trainings = false;
    @track homeToggle = false;
    @track isloggedin = false;

    handleItemClick(event) {
        const selectedItem = event.currentTarget;
        const navigationItems = this.template.querySelectorAll('lightning-vertical-navigation-item');
    
        navigationItems.forEach(item => {
          if (item !== selectedItem) {
            item.style.setProperty('--lwc-text-color', 'transparent');
          }
        });
    
        selectedItem.style.setProperty('--lwc-text-color', 'transparent');
      }



    //    connectedCallback() {
    //         if (this.currentContent !== 'cittacore') {
    //         const cittacoreTab = this.template.querySelector('[name="cittacore"]');
    //         if (cittacoreTab) {
    //             cittacoreTab.click();
    //         }
    //     }
    //    }
    get toggleIconClass() {
        return this.isNavigationVisible ? 'active' : '';
    }

    connectedCallback() {
        // Disable navigation bar by default
        this.isNavigationVisible = false;
        this.addEventListener('flagchange', this.handleFlagChange.bind(this));
        //  this.homeValue = true;
        // this.currentContent = home;
        // this.homeValue = true;
    }
    renderedCallback() {
        this.isLoggedIn = false;
        if (!this.currentContent) {
            // Set the first item as the current content
            const firstItem = this.template.querySelector('lightning-vertical-navigation-item');
            if (firstItem) {
                this.currentContent = firstItem.name;
                this.changeHandleAction({ detail: { name: this.currentContent } });
            }
        }
    }

    handleFlagChange(event) {
        this.isLoggedIn = event.detail;
        console.log('isLoggedIn', this.isLoggedIn);
    }

    toggleNavigation() {
        this.isNavigationVisible = !this.isNavigationVisible;
    }

    changeHandleAction(event) {
        const selected = event.detail.name;
        console.log('selected',selected);
        this.currentContent = selected;
        if (selected == 'Home') {
            this.homeValue = true;
          
            console.log('isloggedin', this.isloggedin);
        } else {
            this.homeValue = false;
         }

        if (selected == 'PersonalDetails') {
            console.log('email ' + this.email);
            this.personalDetailsValue = true;
        } else {
            this.personalDetailsValue = false;
        }

        if (selected == 'MyProjects') {
            this.myProjectsValue = true;
        } else {
            this.myProjectsValue = false;
        }

        if (selected == 'MyPerformance') {
            this.myPerformanceValue = true;
        } else {
            this.myPerformanceValue = false;
        }

        if (selected == 'Leaves') {
            this.leavesValue = true;
        } else {
            this.leavesValue = false;
        }

        if (selected == 'jobopenings') {
            this.jobOpeningsValue = true;
        } else {
            this.jobOpeningsValue = false;
        }
        if (selected == 'Awards') {
            console.log(this.email);
            this.awardValue = true;
        } else {
            this.awardValue = false;
        }
        if (selected == 'InterviewSchedule') {
            console.log('interview email ' + this.email);
            this.interviewSheduleValue = true;
        } else {
            this.interviewSheduleValue = false;
        }
        if (selected == 'Resignation') {
            this.resignationValue = true;
        } else {
            this.resignationValue = false;
        }
        if (selected == 'Trainings') {
            this.trainings = true;
        } else {
            this.trainings = false;
        }

    }
}