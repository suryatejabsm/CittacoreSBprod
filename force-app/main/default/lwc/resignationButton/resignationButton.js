import { LightningElement,track } from 'lwc';
export default class ResignationButton extends LightningElement {
    @track showResignationPage = false;
    @track isPopupOpen = false;
    @track resignationDate;
  @track relievingDate;
  

 handleLogin(){
        this.isPopupOpen = true;
        this.showResignationPage = true;
    }
     handleClose() {
        this.isPopupOpen = false;
        this.showResignationPage = false;
       // this.removeContainerClass();
    }
    Resign(){
        this.isPopupOpen = false;
        this.showResignationPage = false;
    }
       /*removeContainerClass() {
        const container = this.template.querySelector('.container');
        container.classList.remove('is-popup-open');
    }*/
    connectedCallback() {
    // Set the resignation date to today's date
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // Format month and day to have leading zeros if necessary
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }

    this.resignationDate = `${year}-${month}-${day}`;

    // Set the relieving date to 90 days from today
    const relievingDate = new Date(today);
    relievingDate.setDate(relievingDate.getDate() + 90);

    const relievingYear = relievingDate.getFullYear();
    let relievingMonth = relievingDate.getMonth() + 1;
    let relievingDay = relievingDate.getDate();

    // Format relieving month and day to have leading zeros if necessary
    if (relievingMonth < 10) {
      relievingMonth = '0' + relievingMonth;
    }
    if (relievingDay < 10) {
      relievingDay = '0' + relievingDay;
    }

    this.relievingDate = `${relievingYear}-${relievingMonth}-${relievingDay}`;
  }
}