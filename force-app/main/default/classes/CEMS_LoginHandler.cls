public without sharing class CEMS_LoginHandler 
{
    public class CustomException extends Exception{}

    @AuraEnabled
    public static void applicantGenerateOtpHandler(String name, String email){
        RecordType applicantRecordType = [Select Id, DeveloperName, SobjectType FROM recordType WHERE DeveloperName = 'Applicant_Login' and  SobjectType = 'CEMS_User_Login__c' LIMIT 1];
        List<CEMS_Personnel__c> applicant = [SELECT id, Name, CEMS_Email__c FROM CEMS_Personnel__c WHERE Name=:name AND CEMS_Email__c=:email  LIMIT 1];
        System.debug(applicant);
        if(applicant.size() <= 0)
        {
            throw new CustomException('Cant find any record. Please register');
        }

        Integer verificationCode = Math.mod(Math.abs((Integer)Crypto.getRandomInteger()) , 900000) + 100000; 
        System.debug(verificationCode);
        CEMS_User_Login__c user = new CEMS_User_Login__c();
        user.Personnel__c = applicant[0].Id;
        user.Email_Address__c = email;
        user.Applicant_Name__c = applicant[0].Name;
        user.OTP__c = String.valueOf(verificationCode);
        user.Is_Used__c = False;
        user.recordTypeId = applicantRecordType.Id;
        insert user;

        // List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();
        // Messaging.SingleEmailMessage emailsForCase=new Messaging.SingleEmailMessage();
        // emailsForCase.setToAddresses(new List<String> {user.Email_Address__c});
        // emailsForCase.setSubject('Case Number Closed '+user.OTP__c);
        // emailsForCase.setPlainTextBody('OTP');
        // emailsForCase.setSaveAsActivity(false);
        // emails.add(emailsForCase);
        // Messaging.sendEmail(emails);


    }

    @AuraEnabled
    public static void applicantValidateOtpHandler(String name, String email, String otp){
        List<CEMS_User_Login__c> user = [select id, Applicant_Name__c, Email_Address__c from CEMS_User_Login__c where Applicant_Name__c=:name AND Email_Address__c=:email AND OTP__c=:otp AND Is_Used__c=False ORDER BY LastModifiedDate DESC limit 1];
        System.debug(user);
        if(user.size() <= 0)
        {
            throw new CustomException('OTP Mismatch');
        }
        user[0].Is_Used__c = True;
        update user;
    }

    //  @AuraEnabled
    // public static void employeeValidateOtpHandler(String employeeId, String emailId, String otp)
    // {
    //     List<CEMS_User_Login__c> user = [select id,Email_Address__c,Employee_Id__c from CEMS_User_Login__c where Employee_Id__c=:employeeId AND Email_Address__c=:emailId AND OTP__c=:otp AND Is_Used__c=False ORDER BY LastModifiedDate DESC limit 1];
    //     if(user.size() <= 0)
    //     {
    //         throw new CustomException('OTP Mismatch');
    //     }
    //     user[0].Is_Used__c = True;
    //     update user;
    // }



    @AuraEnabled
    public static void employeeGenerateOtpHandler(String employeeId, String emailId)
    {
        RecordType employeeRecordType = [Select Id, DeveloperName, SobjectType FROM recordType WHERE DeveloperName = 'Employee_Login' and  SobjectType = 'CEMS_User_Login__c'  LIMIT 1];
        List<CEMS_Personnel__c> employee = [SELECT Id, CEMS_Work_Email__c, CEMS_Employee_ID__c FROM CEMS_Personnel__c WHERE CEMS_Employee_ID__c =:employeeId AND CEMS_Work_Email__c=:emailId LIMIT 1];
        if(employee.size() <= 0)
        {
            throw new QueryException('Employee Record Doesnt Exist');
        }

        Integer verificationCode = Math.mod(Math.abs((Integer)Crypto.getRandomInteger()) , 900000) + 100000; 
        System.debug(verificationCode);
        CEMS_User_Login__c user = new CEMS_User_Login__c();
        user.Personnel__c = employee[0].Id;
        user.Employee_Id__c = employeeId;
        user.Email_Address__c = emailId;
        user.RecordTypeId = employeeRecordType.Id;
        user.OTP__c = String.valueOf(verificationCode);
        user.Is_Used__c = False;
        insert user;

        System.debug(user);
/*
        List<OrgWideEmailAddress> orgEmail = [Select Id from OrgWideEmailAddress where Address = 'arpita@cittacore.com'];
        List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();
        Messaging.SingleEmailMessage emailsForCase=new Messaging.SingleEmailMessage();
        emailsForCase.setToAddresses(new List<String> {user.Email_Address__c});
        emailsForCase.setSubject('OTP '+user.OTP__c);
        emailsForCase.setPlainTextBody('OTP');
        emailsForCase.setSaveAsActivity(false);
        emailsForCase.setOrgWideEmailAddressId(orgEmail[0].Id);
        emails.add(emailsForCase);
        Messaging.sendEmail(emails);
        System.debug(emailsForCase);*/

    }

    
    @AuraEnabled
    public static void employeeValidateOtpHandler(String employeeId, String emailId, String otp)
    {
        List<CEMS_User_Login__c> user = [select id,Email_Address__c,Employee_Id__c from CEMS_User_Login__c where Employee_Id__c=:employeeId AND Email_Address__c=:emailId AND OTP__c=:otp AND Is_Used__c=False ORDER BY LastModifiedDate DESC limit 1];
        if(user.size() <= 0)
        {
            throw new CustomException('OTP Mismatch');
        }
        user[0].Is_Used__c = True;
        update user;
    }
}