import { LightningElement, track } from 'lwc';
 
export default class Sidebar extends LightningElement {
   
    @track currentContent = 'Home';
    @track cittacoreValue = false;    
    @track jobopeningsValue = false;
    @track jobapplicationsValue = false;
    @track interviewscheduleValue = false;
    @track dashboardValue = false;
    @track salesforceLwcValue = false;
    @track isNavigationVisible = true;
   
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
  }

  toggleNavigation() {
    this.isNavigationVisible = !this.isNavigationVisible;
  }
  
    changeHandleAction(event) {
        const selected = event.detail.name;        

        this.currentContent = selected;
      
 
        if (selected == 'Home'){
            this.HomeValue = true;
        }else{
            this.HomeValue = false;
        }
 
        if (selected == 'PersonalDetails'){
            this.PersonalDetailsValue = true;
        }else{
            this.PersonalDetailsValue = false;
        }
 
        if (selected == 'MyProjects'){
            this.MyProjectsValue = true;
        }else{
            this.MyProjectsValue = false;
        }
 
        if (selected == 'MyPerformance'){
            this.MyPerformanceValue = true;
        }else{
            this.MyPerformanceValue = false;
        }
 
        if (selected == 'Leaves'){
            this.LeavesValue = true;
        }else{
            this.LeavesValue = false;
        }
 
        if (selected == 'salesforceLwc'){
            this.salesforceLwcValue = true;
        }else{
            this.salesforceLwcValue = false;
        }
         if (selected == 'jobopenings'){
            this.jobopeningsValue = true;
        }else{
            this.jobopeningsValue = false;
        }
         if (selected == 'Awards'){
            this.AwardsValue = true;
        }else{
            this.AwardsValue = false;  
        }
        if (selected == 'Prescreening2'){
            this.Prescreening2 = true;
        }else{
            this.Prescreening2 = false;
            
        }
        if (selected == 'InterviewSchedule'){
            this.InterviewScheduleValue = true;
        }else{
            this.InterviewScheduleValue = false;
        }
        if (selected == 'Resignation'){
            this.ResignationValue = true;
        }else{
            this.ResignationValue = false;
        }

 
    }
}