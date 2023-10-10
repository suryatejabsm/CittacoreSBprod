import { LightningElement, wire, api, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

export default class FetchSkillsWithRating extends LightningElement {
  @api recordId;

  @track skill1;
  @track skill1Rating;
  @track skill1Comment;
  @track skill2;
  @track skill2Rating;
  @track skill2Comment;
  @track skill3;
  @track skill3Rating;
  @track skill3Comment;
  @track skill4;
  @track skill4Rating;
  @track skill4Comment;
  @track skill5;
  @track skill5Rating;
  @track skill5Comment;
  @track skill6;
  @track skill6Rating;
  @track skill6Comment;
  @track feedback;

  @wire(getRecord, { recordId: '$recordId', layoutTypes: ['Full'], modes: ['View'], fields: [
    'CEMS_Internal_Scheduler__c.CEMS_Skill_1__c',
    'CEMS_Internal_Scheduler__c.CEMS_Skill_1_Rating__c',
    'CEMS_Internal_Scheduler__c.CEMS_Skill_1_Comment__c',
    'CEMS_Internal_Scheduler__c.CEMS_Skill_2__c',
    'CEMS_Internal_Scheduler__c.CEMS_Skill_2_Rating__c',
    'CEMS_Internal_Scheduler__c.CEMS_Skill_2_Comment__c',
    'CEMS_Internal_Scheduler__c.CEMS_Skill_3__c',
    'CEMS_Internal_Scheduler__c.CEMS_Skill_3_Rating__c',
    'CEMS_Internal_Scheduler__c.CEMS_Skill_3_Comment__c',
    'CEMS_Internal_Scheduler__c.CEMS_Skill_4__c',
    'CEMS_Internal_Scheduler__c.CEMS_Skill_4_Rating__c',
    'CEMS_Internal_Scheduler__c.CEMS_Skill_4_Comment__c',
    'CEMS_Internal_Scheduler__c.CEMS_Skill_5__c',
    'CEMS_Internal_Scheduler__c.CEMS_Skill_5_Rating__c',
    'CEMS_Internal_Scheduler__c.CEMS_Skill_5_Comment__c',
    'CEMS_Internal_Scheduler__c.CEMS_Skill_6__c',
    'CEMS_Internal_Scheduler__c.CEMS_Skill_6_Rating__c',
    'CEMS_Internal_Scheduler__c.CEMS_SKill_6_Comment__c',
    'CEMS_Internal_Scheduler__c.CEMS_Feedback_Comments__c'
  ] }) 
  async skillsHandler({ error, data }) {
    if (data) {
      try {
        const record = data.fields;
        this.skill1 = this.getFieldValue(record, 'CEMS_Skill_1__c');
        this.skill1Rating = this.getFieldValue(record, 'CEMS_Skill_1_Rating__c');
        this.skill1Comment = this.getFieldValue(record, 'CEMS_Skill_1_Comment__c');

        this.skill2 = this.getFieldValue(record, 'CEMS_Skill_2__c');
        this.skill2Rating = this.getFieldValue(record, 'CEMS_Skill_2_Rating__c');
        this.skill2Comment = this.getFieldValue(record, 'CEMS_Skill_2_Comment__c');
        console.log('Skill2Rating:' +this.skill2Rating);
        console.log('skill2Comment'+ this.skill2Comment);
        this.skill3 = this.getFieldValue(record, 'CEMS_Skill_3__c');
        this.skill3Rating = this.getFieldValue(record, 'CEMS_Skill_3_Rating__c');
        this.skill3Comment = this.getFieldValue(record, 'CEMS_Skill_3_Comment__c');
        console.log('Skill3Rating:' +this.skill3Rating);
        console.log('skill3Comment'+ this.skill3Comment);
        this.skill4 = this.getFieldValue(record, 'CEMS_Skill_4__c');
        this.skill4Rating = this.getFieldValue(record, 'CEMS_Skill_4_Rating__c');
        this.skill4Comment = this.getFieldValue(record, 'CEMS_Skill_4_Comment__c');

        this.skill5 = this.getFieldValue(record, 'CEMS_Skill_5__c');
        this.skill5Rating = this.getFieldValue(record, 'CEMS_Skill_5_Rating__c');
        this.skill5Comment = this.getFieldValue(record, 'CEMS_Skill_5_Comment__c');

        this.skill6 = this.getFieldValue(record, 'CEMS_Skill_6__c');
        this.skill6Rating = this.getFieldValue(record, 'CEMS_Skill_6_Rating__c');
        this.skill6Comment = this.getFieldValue(record, 'CEMS_SKill_6_Comment__c');
        console.log('Skill6Rating:'+ this.skill6Rating);
        console.log('skill6Comment'+  this.skill6Comment);
        this.feedback = this.getFieldValue(record, 'CEMS_Feedback_Comments__c');

        console.log('Feedback comment:'+ this.feedback);
      } catch (error) {
        console.error('Error retrieving skills:', error);
      }
    } else if (error) {
      console.error('Error retrieving skills:', error);
    }
  }

  getFieldValue(record, fieldApiName) {
    const field = record[fieldApiName];
    if (field) {
      if (field.displayValue) {
        return field.displayValue;
      } else if (field.value) {
        return field.value;
      }
    }
    return '';
  }
}  
//   getFieldValue(record, fieldApiName) {
//     return record[fieldApiName]?.displayValue || record[fieldApiName]?.value;
// }
// }

/*
import { LightningElement, wire, api, track } from 'lwc';
import {getRecord} from 'lightning/uiRecordApi'


export default class FetchSkillsWithRating extends LightningElement {
    skill1
    skill1Rating
    skill1Comment
    skill2
    skill2Rating
    skill2Comment
    skill3
    skill3Rating
    skill3Comment
    skill4
    skill4Rating
    skill4Comment
    skill5
    skill5Rating
    skill5Comment
    skill6
    skill6Rating
    skill6Comment
    feedback
    @api recordId
    // @wire(getRecord, {recordId:'$recordId',
    //  fields:[NAME_FIELD, OWNER_NAME_FIELD, ANNUAL_REVENUE_FIELD]})
    @wire(getRecord, {recordId:'$recordId',
     layoutTypes:['Full'], modes:['View']})
     async skillsHandler({data}){
         if(data){
             console.log(data)
             try {
             this.skill1 = data.fields.CEMS_Skill_1__c.displayValue ? data.fields.CEMS_Skill_1__c.displayValue:
             data.fields.CEMS_Skill_1__c.value
             this.skill1Rating = data.fields.CEMS_Skill_1_Rating__c.displayValue ? data.fields.CEMS_Skill_1_Rating__c.displayValue:
             data.fields.CEMS_Skill_1_Rating__c.value
             this.skill1Comment = data.fields.CEMS_Skill_1_Comment__c.displayValue ? data.fields.CEMS_Skill_1_Comment__c.displayValue:
             data.fields.CEMS_Skill_1_Comment__c.value

             this.skill2 = data.fields.CEMS_Skill_2__c.displayValue ? data.fields.CEMS_Skill_2__c.displayValue:
             data.fields.CEMS_Skill_1__c.value
             this.skill2Rating = data.fields.CEMS_Skill_2_Rating__c.displayValue ? data.fields.CEMS_Skill_2_Rating__c.displayValue:
             data.fields.CEMS_Skill_2_Rating__c.value
             this.skill2Comment = data.fields.CEMS_Skill_2_Comment__c.displayValue ? data.fields.CEMS_Skill_2_Comment__c.displayValue:
             data.fields.CEMS_Skill_2_Comment__c.value

             this.skill3 = data.fields.CEMS_Skill_3__c.displayValue ? data.fields.CEMS_Skill_3__c.displayValue:
             data.fields.CEMS_Skill_3__c.value
             this.skill3Rating = data.fields.CEMS_Skill_3_Rating__c.displayValue ? data.fields.CEMS_Skill_3_Rating__c.displayValue:
             data.fields.CEMS_Skill_3_Rating__c.value
             this.skill3Comment = data.fields.CEMS_Skill_3_Comment__c.displayValue ? data.fields.CEMS_Skill_3_Comment__c.displayValue:
             data.fields.CEMS_Skill_3_Comment__c.value

             this.skill4 = data.fields.CEMS_Skill_4__c.displayValue ? data.fields.CEMS_Skill_4__c.displayValue:
             data.fields.CEMS_Skill_4__c.value
             this.skill4Rating = data.fields.CEMS_Skill_4_Rating__c.displayValue ? data.fields.CEMS_Skill_4_Rating__c.displayValue:
             data.fields.CEMS_Skill_4_Rating__c.value
             this.skill4Comment = data.fields.CEMS_Skill_4_Comment__c.displayValue ? data.fields.CEMS_Skill_4_Comment__c.displayValue:
             data.fields.CEMS_Skill_4_Comment__c.value

             this.skill5 = data.fields.CEMS_Skill_5__c.displayValue ? data.fields.CEMS_Skill_5__c.displayValue:
             data.fields.CEMS_Skill_5__c.value
             this.skill5Rating = data.fields.CEMS_Skill_5_Rating__c.displayValue ? data.fields.CEMS_Skill_5_Rating__c.displayValue:
             data.fields.CEMS_Skill_5_Rating__c.value
             this.skill5Comment = data.fields.CEMS_Skill_5_Comment__c.displayValue ? data.fields.CEMS_Skill_5_Comment__c.displayValue:
             data.fields.CEMS_Skill_5_Comment__c.value

             this.skill6 = data.fields.CEMS_Skill_6__c.displayValue ? data.fields.CEMS_Skill_6__c.displayValue:
             data.fields.CEMS_Skill_6__c.value
             this.skill6Rating = data.fields.CEMS_Skill_6_Rating__c.displayValue ? data.fields.CEMS_Skill_6_Rating__c.displayValue:
             data.fields.CEMS_Skill_6_Rating__c.value
             this.skill6Comment = data.fields.CEMS_Skill_6_Comment__c.displayValue ? data.fields.CEMS_Skill_6_Comment__c.displayValue:
             data.fields.CEMS_Skill_6_Comment__c.value

             console.log('Skill6: '+this.skill6 );

             this.feedback = data.fields.CEMS_Feedback_Comments__c.displayValue
                    ? data.fields.CEMS_Feedback_Comments__c.displayValue
                    : data.fields.CEMS_Feedback_Comments__c.value
             
            console.log('Feedback comment ::::' + this.feedback);
             
            } catch (error) {
                console.error('Error retrieving skills:', error);
            }
        } else if (error) {
            console.error('Error retrieving skills:', error);
        }
         }
     }*/

    /*
    import { LightningElement, wire, api, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

export default class FetchSkillsWithRating extends LightningElement {
    @track data; // Track the fetched data
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', layoutTypes: ['Full'], modes: ['View'] })
    async skillsHandler({ error, data }) {
        if (data) {
            try {
                this.data = {
                    skill1: this.formatFieldValue(data, 'CEMS_Skill_1__c'),
                    skill1Rating: this.formatFieldValue(data, 'CEMS_Skill_1_Rating__c'),
                    skill1Comment: this.formatFieldValue(data, 'CEMS_Skill_1_Comment__c'),
                    skill2: this.formatFieldValue(data, 'CEMS_Skill_2__c'),
                    skill2Rating: this.formatFieldValue(data, 'CEMS_Skill_2_Rating__c'),
                    skill2Comment: this.formatFieldValue(data, 'CEMS_Skill_2_Comment__c'),
                    skill3: this.formatFieldValue(data, 'CEMS_Skill_3__c'),
                    skill3Rating: this.formatFieldValue(data, 'CEMS_Skill_3_Rating__c'),
                    skill3Comment: this.formatFieldValue(data, 'CEMS_Skill_3_Comment__c'),
                    skill4: this.formatFieldValue(data, 'CEMS_Skill_4__c'),
                    skill4Rating: this.formatFieldValue(data, 'CEMS_Skill_4_Rating__c'),
                    skill4Comment: this.formatFieldValue(data, 'CEMS_Skill_4_Comment__c'),
                    skill5: this.formatFieldValue(data, 'CEMS_Skill_5__c'),
                    skill5Rating: this.formatFieldValue(data, 'CEMS_Skill_5_Rating__c'),
                    skill5Comment: this.formatFieldValue(data, 'CEMS_Skill_5_Comment__c'),
                    skill6: this.formatFieldValue(data, 'CEMS_Skill_6__c'),
                    skill6Rating: this.formatFieldValue(data, 'CEMS_Skill_6_Rating__c'),
                    skill6Comment: this.formatFieldValue(data, 'CEMS_Skill_6_Comment__c'),
                    feedback: this.formatFieldValue(data, 'CEMS_Feedback_Comments__c')
                };
            } catch (error) {
                console.error('Error retrieving skills:', error);
            }
        } else if (error) {
            console.error('Error retrieving skills:', error);
        }
    }

    formatFieldValue(data, field) {
        const displayValue = data.fields[field].displayValue;
        const value = data.fields[field].value;
        return displayValue ? displayValue : value;
    }
}
*/