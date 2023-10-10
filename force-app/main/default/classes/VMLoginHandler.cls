public with sharing class VMLoginHandler {
    public class CustomException extends Exception{}
    @AuraEnabled
    public static void employeeGenerateOtpHandler(String employeeId, String emailId) {
        RecordType employeeRecordType = [SELECT Id, DeveloperName, SobjectType FROM RecordType WHERE DeveloperName = 'Employee_Login' AND SobjectType = 'CEMS_User_Login__c' LIMIT 1];
        List<CEMS_Personnel__c> employee = [SELECT Id, Name, CEMS_Work_Email__c, CEMS_Employee_ID__c FROM CEMS_Personnel__c WHERE CEMS_Employee_ID__c = :employeeId AND CEMS_Work_Email__c = :emailId LIMIT 1];
        
        if (employee.size() <= 0) {
            throw new QueryException('Employee Record Does Not Exist');
        }
        
        Integer verificationCode = Math.mod(Math.abs((Integer) Crypto.getRandomInteger()), 900000) + 100000;
        System.debug(verificationCode);
        
        CEMS_User_Login__c user = new CEMS_User_Login__c();
        user.Personnel__c = employee[0].Id;
        user.Employee_Id__c = employeeId;
        user.Email_Address__c = emailId;
        user.RecordTypeId = employeeRecordType.Id;
        user.OTP__c = String.valueOf(verificationCode);
        user.Is_Used__c = false;
        insert user;
        System.debug(user);
        
        List<OrgWideEmailAddress> orgEmail = [SELECT Id FROM OrgWideEmailAddress WHERE Address = 'arpita@cittacore.com'];
        List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();
        
        Messaging.SingleEmailMessage emailForCase = new Messaging.SingleEmailMessage();
        emailForCase.setToAddresses(new List<String> { user.Email_Address__c });
        emailForCase.setSubject('OTP ' + user.OTP__c);
        emailForCase.setPlainTextBody('OTP');
        emailForCase.setSaveAsActivity(false);
        emailForCase.setOrgWideEmailAddressId(orgEmail[0].Id);
        
        emails.add(emailForCase);
        Messaging.sendEmail(emails);
        
        System.debug(emailForCase);
    }

    @AuraEnabled
    public static void employeeValidateOtpHandler(String employeeId, String emailId, String otp) {
        List<CEMS_User_Login__c> users = [
            SELECT Id, Email_Address__c, Employee_Id__c,Personnel__r.Name
            FROM CEMS_User_Login__c
            WHERE Employee_Id__c = :employeeId
                AND Email_Address__c = :emailId
                AND OTP__c = :otp
                AND Is_Used__c = false
            ORDER BY LastModifiedDate DESC
            LIMIT 1
        ];
        
        if (users.size() <= 0) {
            throw new CustomException('OTP Mismatch');
        }
        
        users[0].Is_Used__c = true;
        update users;
    }
}