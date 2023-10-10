import { LightningElement, wire, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import skillsFetched from '@salesforce/apex/FetchSkillsFromJobOpening.skillsFetched';
import saveRatingsAndComments from '@salesforce/apex/FetchSkillsFromJobOpening.saveRatingsAndComments';

export default class InterviewFeedback extends LightningElement {
    @api recordId; // Record ID passed as an attribute
    @track skills;
    @track feedbackRecords = [];
    @track timeout = 3000;
    @track sticky = false;
   
   // @track feedbackSubmitted = false; // Property to track whether feedback is submitted or not
    commentChangeTimeout
    @track feedbackComment = '';

    
    

   


    @wire(skillsFetched, { recordId: '$recordId' })
    wiredSkills({ data, error }) {
        if (data) {
          
            this.skills = data;
            console.log('skills'+this.skills);
            this.initializeFeedbackRecords();
            
    
        } else if (error) {
            console.error(error);
        }
    }

    initializeFeedbackRecords() {
        // Initialize feedbackRecords with existing values for each skill
        this.feedbackRecords = this.skills.map(skill => {
            const existingRecord = this.feedbackRecords.find(record => record.SkillName === skill);
    
            if (existingRecord) {
                return {
                    ...existingRecord,
                    Id: this.recordId,
                    SkillName: skill
                };
            }
    
            const record = {};
            record.Id = this.recordId;
            record.SkillName = skill;
            record.SkillRating = null;
            record.SkillComment = '';
            record.feedComment = '';
            return record;
        });
    
        console.log('Skills:', this.skills);
        console.log('Feedback Records:', JSON.stringify(this.feedbackRecords));
    }

    handleRatingChange(event) {
        
        const skillName = event.target.dataset.skill;
        const value = parseInt(event.target.value);
        
        console.log('Skill Name:', skillName);
        console.log('Rating Value:', value);

        // Update the corresponding skill rating field in feedbackRecords
        this.feedbackRecords = this.feedbackRecords.map(record => {
            if (record.SkillName === skillName) {
                return { ...record, SkillRating: value };
            }
           
            return record;
        });
        
        console.log('Feedback Records:', JSON.stringify(this.feedbackRecords));
    }


    handleCommentChange(event) {
        const skillName = event.target.dataset.skill;
        const value = event.target.value;
        
        console.log('Skill Name:', skillName);
        console.log('Comment Value:', value);

        // Cancel the previous timeout if it exists
        if (this.commentChangeTimeout) {
            clearTimeout(this.commentChangeTimeout);
        }

        // Set a new timeout to update the feedback records after 1 second
        this.commentChangeTimeout = setTimeout(() => {
            // Update the corresponding skill comment field in feedbackRecords
            this.feedbackRecords = this.feedbackRecords.map(record => {
                if (record.SkillName === skillName) {
                    return { ...record, SkillComment: value };
                }
              
                return record;
            });

            console.log('Feedback Records:', JSON.stringify(this.feedbackRecords));
        }, 1000);
    }
    
    handleFeedbackCommentChange(event) {
        this.feedbackComment = event.target.value;
        
    }
    @track feedbackSubmitted = false;
    @track readOnlyMode = false;
 
   
    handleSave() {
        // Check if any feedback record has empty rating or comment
        const isFeedbackEmpty = this.feedbackRecords.some(
            record => record.SkillRating === null || record.SkillComment === ''
        );
          
        
        if (isFeedbackEmpty ) {
            // Show a toast notification for the validation error
            this.template.querySelector("c-custom-toast-messages").showToast("error", "Please enter ratings and comments for all skills");
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Please enter ratings and comments for all skills',
                    variant: 'error',
                })
            );
            return;
        }
    
        // Generate unique IDs for each feedback record if needed
        console.log('Feedback Records:', JSON.stringify(this.feedbackRecords));
    
        // Make a copy of feedbackRecords
        const feedbackrec = [...this.feedbackRecords];
    
        console.log('Feedback Records with IDs:', JSON.stringify(feedbackrec));
       
    
        const saveFeedback = async () => {
              // Check if feedback has already been submitted
   
            try {
                // Call the Apex method to save the ratings and comments
                await saveRatingsAndComments({ records: feedbackrec, recordId: this.recordId, feedbackComment: this.feedbackComment });
                this.template.querySelector("c-custom-toast-messages").showToast("success", "Feedback has been successfully submitted.");
                // Show a toast notification for successful save
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Ratings and comments saved successfully',
                        variant: 'success',
                    })
                );
    
                // Reset the feedbackRecords to clear the form
                this.initializeFeedbackRecords();
                 // Set feedbackSubmitted to true to indicate that feedback is submitted
            this.feedbackSubmitted = true;
                   // Hide the component and show the button after saving
                   // Set readOnlyMode to true to make the input fields read-only
            this.readOnlyMode = true;
            
                this.showComponent = false;
                this.showButton = true;
                
            } catch (error) {
                // Handle the error in saving
                console.error('Error saving ratings and comments:', error);
    
                // Show a toast notification for the error
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Error saving ratings and comments',
                        variant: 'error',
                    })
                );
            }
        };
    
        saveFeedback();
         
    }

    handleReset() {
        
        this.feedbackRecords = this.feedbackRecords.map(record => ({
            ...record,
            SkillRating: null,
            SkillComment: '',
        }));
    
        const inputFields = this.template.querySelectorAll('lightning-input');
        const textAreas = this.template.querySelectorAll('lightning-textarea');
    
        inputFields.forEach(field => {
            field.value = null;
        });
    
        textAreas.forEach(area => {
            area.value = null;
        });
    }
    
   
      
     
      
                }