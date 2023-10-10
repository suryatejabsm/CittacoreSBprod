import { LightningElement, wire, track } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import USER_ID from '@salesforce/user/Id';
import NAME_FIELD from '@salesforce/schema/User.Name';
import EMPLOYEE_ID_FIELD from '@salesforce/schema/CEMS_Personnel__c.CEMS_Employee_ID__c';
import WORK_EMAIL_FIELD from '@salesforce/schema/CEMS_Personnel__c.CEMS_Work_Email__c';
import WORK_LOCATION_FIELD from '@salesforce/schema/CEMS_Personnel__c.CEMS_Work_Location__c';
//import POSITION_FIELD from '@salesforce/schema/Personnel__c.CEMSPosition__c';
import REPORTING_MANAGER_FIELD from '@salesforce/schema/CEMS_Personnel__c.CEMS_Reporting_Manager__c';
import COMPLETE_ADDRESS_FIELD from '@salesforce/schema/CEMS_Personnel__c.CEMSAddress__c';

export default class cemsPersonalInformation extends LightningElement {
    @track employeeData;

    @wire(getRecord, { recordId: USER_ID, fields: [NAME_FIELD] })
    userData({ error, data }) {
        if (data) {
            this.employeeData = { Name: getFieldValue(data, NAME_FIELD) };
        } else if (error) {
            // Handle error
        }
    }

    @wire(getRecord, { recordId: USER_ID, fields: [
        EMPLOYEE_ID_FIELD,
        WORK_EMAIL_FIELD,
        WORK_LOCATION_FIELD,
        //POSITION_FIELD,
        REPORTING_MANAGER_FIELD,
        COMPLETE_ADDRESS_FIELD
    ] })
    personnelData({ error, data }) {
        if (data) {
            const personnelRecord = data.fields;
            this.employeeData = {
                ...this.employeeData,
                EmployeeId: getFieldValue(personnelRecord, EMPLOYEE_ID_FIELD),
                WorkEmail: getFieldValue(personnelRecord, WORK_EMAIL_FIELD),
                WorkLocation: getFieldValue(personnelRecord, WORK_LOCATION_FIELD),
                //Position: getFieldValue(personnelRecord, POSITION_FIELD),
                ReportingManager: getFieldValue(personnelRecord, REPORTING_MANAGER_FIELD),
                CompleteAddress: getFieldValue(personnelRecord, COMPLETE_ADDRESS_FIELD)
            };
        } else if (error) {
            // Handle error
        }
    }
}