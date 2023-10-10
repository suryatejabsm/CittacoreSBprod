public Without Sharing class EmailTriggerHelper {
    //static method
    public static List<CEMS_Leave__c> sendEmail(List<CEMS_Leave__c> leaves) {

        //query on template object
        EmailTemplate et=[Select id from EmailTemplate where name='Leave_Apply'];

        //list of emails
        List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();

        //loop
        for(CEMS_Leave__c con : leaves){

            //check for Account
            if(con.Emp_Email__c != null){

                //initiallize messaging method
                Messaging.SingleEmailMessage singleMail = new Messaging.SingleEmailMessage();

                //set object Id
                singleMail.setTargetObjectId(con.Id);

                //set template Id
                singleMail.setTemplateId(et.Id);

                //flag to false to stop inserting activity history
                singleMail.setSaveAsActivity(false);

                //add mail
                emails.add(singleMail);

               //This will not send email to contact  
               //emails.setTreatTargetObjectAsRecipient(false);
            }
        }

        //send mail
        Messaging.sendEmail(emails);

        return leaves;
    }
    
    //static method
    public static List<CEMS_Leave__c> sendEmailCustom(List<CEMS_Leave__c> leaves) 
    {
        //query on template object
        EmailTemplate et=[Select id,HtmlValue,Body from EmailTemplate where name='Leave_Apply'];
        
        set<id> recIds = new set<id>();
        List<String> sendToEmail = new List<String>();
        // Step 0: Create a master list to hold the emails we'll send
        List<Messaging.SingleEmailMessage> mails =
            new List<Messaging.SingleEmailMessage>();
        
        for (CEMS_Leave__c surv : leaves) {
            
            if (surv.CEMS_Employee__c != null )
            {
                recIds.add(surv.Id);
                //sendToEmail.add(surv.Emp_Email__c);
            }
        }
        sendToEmail.add('rama.k@cittacore.com');
        List<CEMS_Leave__c> managerList = new List<CEMS_Leave__c>([select Id, CEMS_Employee__c, CEMS_Employee__r.CEMS_Work_Email__c 
                                                                           from CEMS_Leave__c 
                                                                           where id in :recIds]);
        
        for (CEMS_Leave__c surv : managerList) {
            
            if (surv.CEMS_Employee__c != null && surv.CEMS_Employee__r.CEMS_Work_Email__c != null)
            {
                //recIds.add(surv.Id);
                sendToEmail.add(surv.CEMS_Employee__r.CEMS_Work_Email__c);
            }
        }
        
        List<Messaging.SingleEmailMessage> mailList =  new List<Messaging.SingleEmailMessage>();
        
        String htmlBody = et.HtmlValue;
        /*
        //below replaces the UserName with current User Name
        htmlBody = htmlBody.replace('{!Receiving_User.Username}', u.Username);
        //below replaces the FirstName with current User First Name
        htmlBody = htmlBody.replace('{!Receiving_User.FirstName}', u.FirstName);
        */
        String plainBody = et.Body;
        /*
        plainBody = plainBody.replace('{!Receiving_User.Username}', u.Username);
        plainBody = plainBody.replace('{!Receiving_User.FirstName}', u.FirstName);*/
        //Below list is not required, it is just to show that we can send multiple email as well
        //List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>();
        system.debug('sendToEmail====='+sendToEmail);
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        //mail.setTargetObjectId(u.Id);
        mail.setToAddresses(sendToEmail);
        mail.setSenderDisplayName('Support Group');
        mail.setSubject('Welcome! Your Account Details');
        mail.setSaveAsActivity(false);
        mail.setHtmlBody(htmlBody);
        mail.setPlainTextBody(plainBody);
        mailList.add(mail);
        
        /*
        for(Manager__c man:managerList)
        {
            // Step 1: Create a new Email
            Messaging.SingleEmailMessage mail =  new Messaging.SingleEmailMessage();
            
            // Step 2: Set list of people who should get the email
            List<String> sendTo = new List<String>();
            sendTo.add(man.email);
            mail.setToAddresses(sendTo);
        	mail.setToAddresses(sendToEmail);
            
            // Step 3: Set who the email is sent from
            mail.setReplyTo('utkarsha.up10@gmail.com');
            mail.setSenderDisplayName('Utz patil');
            
            // (Optional) Set list of people who should be CC'ed
            List<String> ccTo = new List<String>();
            ccTo.add('puja.patil@aress.com');
            mail.setCcAddresses(ccTo);
            
            // Step 4. Set email contents - you can use variables!
            mail.setSubject('URGENT BUSINESS PROPOSAL');
            String body = 'Dear ' + con.FirstName;
            
            mail.setHtmlBody(body);
            
        
            // Step 5. Add your email to the master list
            mailList.add(mail);
            
        }*/
        Messaging.sendEmail(mailList);
        return leaves;
    }
}