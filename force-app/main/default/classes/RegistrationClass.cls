public without sharing class RegistrationClass {
    public class MyException extends Exception{
    }

    @AuraEnabled
    public static void  registerUser(String firstName, String lastName, String email, String username, String password, String phone,string education,string experience,string panCard,List<Map<String, Object>> attachments){ 
        
        system.debug('firstName'+firstName);
        system.debug('attachments'+attachments);
       
    List<CEMS_Registrations_Data__c> existingUsers = [SELECT Id FROM CEMS_Registrations_Data__c WHERE CEMS_Email__c = :email AND CEMS_PAN_Card_Number__c = :panCard LIMIT 1];
    if (!existingUsers.isEmpty()) {
        throw new AuraHandledException('A user with the same email and pancard already exists. Registration cannot proceed.');
    }

        CEMS_Registrations_Data__c registration = new CEMS_Registrations_Data__c();
        registration.CEMS_First_Name__c = firstName; 
        registration.CEMS_Last_Name__c = lastName; 
        registration.CEMS_Email__c = email;  
        registration.CEMS_Username__c = username;
        registration.CEMS_Password__c = password; 
        registration.CEMS_Phone_No__c = phone;
        //registration.Security_Question_1__c = securityQuestion1;
        registration.CEMS_Education__c =education;
        registration.CEMS_Experience__c = experience;
        registration.CEMS_PAN_Card_Number__c = pancard;
        //registration.Security_Question_2__c = securityQuestion2;
            try {
             insert registration;
           if (attachments != null && !attachments.isEmpty()) {
         List<ContentVersion> contentVersions = new List<ContentVersion>();

            for (Map<String, Object> attachment : attachments) {
                String fileName = (String) attachment.get('Name');
                String fileContent = (String) attachment.get('Body');

                // Create the ContentVersion record
                ContentVersion contentVersion = new ContentVersion();
                contentVersion.Title = fileName;
                contentVersion.PathOnClient = '/' + fileName;
                contentVersion.VersionData = EncodingUtil.base64Decode(fileContent);
                contentVersion.FirstPublishLocationId = registration.Id; // Set the parent record Id

                contentVersions.add(contentVersion);
                system.debug('contentVersion.FirstPublishLocationId'+contentVersion.FirstPublishLocationId);
            }

            insert contentVersions;}
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        
    }
  



    
   /*@AuraEnabled
     public static Boolean validateLogin(String loginemail, String loginpassword){
        system.debug(loginemail);
        system.debug(loginpassword);
    List<CEMS_Registrations_Data__c> registrationDataList = [SELECT Id, CEMS_Password__c, CEMS_Email__c FROM CEMS_Registrations_Data__c WHERE CEMS_Email__c =:loginemail  LIMIT 1 ];
    System.debug(registrationDataList);
    if(registrationDataList.size()<=0){
            throw new MyException('Didnt find records');
    }
    Blob exampleIv = Blob.valueOf('bPmSgVkYp4s6v9t$');
    Blob key = Crypto.generateAesKey(128);
    Blob data = Blob.valueOf(registrationDataList[0].CEMS_Password__c);
    Blob encrypted = Crypto.encrypt('AES128', key, exampleIv, data);

    Blob decrypted = Crypto.decrypt('AES128', key, exampleIv, encrypted);
    String decryptedString = decrypted.toString();
    if(decryptedString.equals(loginpassword)){
        
        return true;
    }else{
        throw new MyException('Invalid Password');
    }
    
   }
/*@AuraEnabled
    public static boolean checkEmailExists(String email){
      EMS_Appointee__c[] appointee = [SELECT id  From EMS_Appointee__c where EMS_Email__c =:email LI  MIT 1];
          Return (!appointee.isempty());
    }  */
    
    
    
 @AuraEnabled(cacheable=true)
public static Boolean hasFilesRelated(String email) {

    CEMS_Registrations_Data__c[] regData = [SELECT Id, CEMS_First_Name__c, CEMS_Email__c FROM CEMS_Registrations_Data__c WHERE CEMS_Email__c = :email LIMIT 1];
    System.debug('regData: ' + regData);
    set<string> data = new set<string>();
    for(CEMS_Registrations_Data__c reg :regData){
        data.add(reg.id);
    }

    List<ContentVersion> fileData = [SELECT Id, FileType, FirstPublishLocationId, ContentLocation FROM ContentVersion WHERE FirstPublishLocationId = :data];
    System.debug('fileData: ' + fileData);
 
    // Check if fileData list is empty
    return !fileData.isEmpty(); 
   
}
}