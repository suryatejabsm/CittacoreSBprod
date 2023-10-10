public with sharing class EmailSender {
    @AuraEnabled
    public static void sendOfferLetterEmail(String recordId) {
       
        CEMS_Job_Application__c jobApplication = [SELECT Id, CEMS_Email__c,Offered_Position__c, CEMS_Last_Name__c,Date_of_Joining__c,Offered_salary__c FROM CEMS_Job_Application__c WHERE Id = :recordId];

       String subject = 'Offer Letter for '+ jobApplication.Offered_Position__c +' role at CittaCore Technologies';
        String body = generateOfferLetter(jobApplication.Offered_Position__c, jobApplication.CEMS_Last_Name__c, jobApplication.Date_of_Joining__c,jobApplication.Offered_salary__c);

        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setToAddresses(new List<String>{ jobApplication.CEMS_Email__c });
        email.setSubject(subject);
        email.setPlainTextBody(body);

       
        Messaging.SendEmailResult[] results = Messaging.sendEmail(new Messaging.SingleEmailMessage[]{ email });
        
      
        if (results[0].isSuccess()) {
            System.debug('Email sent successfully.');
        } else {
            System.debug('Failed to send the email: ' + results[0].getErrors()[0].getMessage());
        }
    }

    public static String generateOfferLetter(String position, String lastname, Date joiningDate, Decimal offeredSalary){
        String offerLetter = 'Dear '+lastname+',\n\n';
        offerLetter += 'Congratulations! You have been selected for the ' + position + ' position at CittaCore Technologies. Please find the offer letter attached.\n\n';
        offerLetter += 'Position: '+position+' \n';
        offerLetter += 'Company: CittaCore Technologies\n';
        offerLetter += 'Location: Hyderabad\n';
        offerLetter += 'Start Date: '+joiningDate+' \n';
        offerLetter += 'Compensation: '+offeredSalary+' \n\n';
    
        offerLetter += 'We believe that joining CittaCore Technologies will provide you with an exceptional opportunity for professional growth and a challenging yet supportive work environment. Your skills and expertise will be valued, and you will have the chance to work on cutting-edge projects alongside a talented and collaborative team.\n\n';
        offerLetter += 'To formally accept this offer, please sign and return the attached copy of the offer letter by Today. If you have any questions or require further clarification regarding the terms of your employment, please do not hesitate to reach out to [HR contact name] at [HR contact email/phone number].\n\n';
        offerLetter += 'We sincerely look forward to welcoming you to the CittaCore Technologies family. We are confident that together, we can achieve great success and create innovative solutions that will make a positive impact in our industry.\n\n';
        offerLetter += 'Congratulations once again, and we eagerly await your acceptance.\n\n';
        offerLetter += 'Best regards,\n';
        offerLetter += '[Your Name]\n';
        offerLetter += '[Your Position]\n';
        offerLetter += 'CittaCore Technologies\n';
        
        return offerLetter;    
    }
}