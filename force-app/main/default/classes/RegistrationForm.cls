public without sharing class RegistrationForm {
  @AuraEnabled
    public static void Register(String firstName, String lastName, String email, String city, String street, String country, String postalCode, String phone, String highestDegree, String qualification, Integer cgpa, String panCard, String experience, String previousCompany, String role, List<AttachmentWrapper> attachments) {
        CEMS_Personnel__c personnel = new CEMS_Personnel__c();
        personnel.RecordTypeId = '012DO0000008XfIYAU';

        personnel.Name = firstName;
        personnel.CEMS_Email__c = email;
        personnel.CEMS_Contact_Number__c = phone;
        personnel.CEMSAddress__Street__s = street;
        personnel.CEMSAddress__PostalCode__s = postalCode;
        personnel.CEMSAddress__City__s = city;
        personnel.CEMS_Highest_Degree__c = highestDegree;
        personnel.CEMS_Board_Of_Qualification__c = qualification;
        personnel.CEMS_CGPA_Percentage__c = cgpa;
        personnel.CEMS_PAN_Card_Number__c = panCard;
        personnel.CEMS_Experience__c = experience;
        personnel.CEMS_Company_Name__c = previousCompany;
        personnel.CEMS_Roles__c = role;

        // Insert the personnel record
        try {
            insert personnel;

            if (attachments != null && !attachments.isEmpty()) {
                List<ContentVersion> contentVersions = new List<ContentVersion>();

                for (AttachmentWrapper attachment : attachments) {
                    ContentVersion cv = new ContentVersion();
                    cv.Title = attachment.fileName;
                    cv.PathOnClient = attachment.fileName;
                    cv.VersionData = attachment.fileContents;
                    cv.FirstPublishLocationId = personnel.Id; // Set the parent record Id
                    contentVersions.add(cv);
                }

                insert contentVersions;
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class AttachmentWrapper {
        @AuraEnabled
        public String fileName { get; set; }
        @AuraEnabled
        public Blob fileContents { get; set; }
    }
    
    public static void verifyLogin(string email){
        
        List<CEMS_Personnel__c> LoginCheck = [SELECT Id, Name, RecordTypeId, CEMS_Work_Email__c, CEMS_Personal_Email__c, CEMS_Email__c, CEMS_PAN_Card_Number__c FROM CEMS_Personnel__c WHERE RecordType.Name='Employee'AND CEMS_Personal_Email__c = :email];
        
        if(LoginCheck.isEmpty()){
            system.debug('empty');           
        }
        
    }
@AuraEnabled(cacheable=true)
    public static List<CEMS_Job_Application__c> getjobApplications(){
  return [SELECT Id, Name, RecordTypeId,RecordType.Name,CEMS_First_Name__c, CEMS_Last_Name__c, CEMS_Email__c,CEMS_Job_Opening__r.Name, CEMS_Pre_Screening_Exam_Link__c, CEMS_Screening_Exam_Score__c, CEMS_Skills__c, CEMS_Work_Experience__c, CEMS_Company_Name__c, CEMS_Role__c, CEMS_Worked_On__c,CEMS_Results__c, CEMS_Pre_Screening__c, CEMS_Referral__c, CEMS_Personnel__c, Notice_Period__c, Back_Ground_Verification__c,CEMS_Expected_Salary__c, Offered_Position__c, Date_of_Joining__c, Budget_Allotted__c, CEMS_Interview_Result__c, Offered_salary__c, CEMS_Stage__c, CEMS_Status__c, Offered_Level__c, CEMS_Joining_Status__c FROM CEMS_Job_Application__c];         
    }
    
    @AuraEnabled(cacheable=true)
    public static List<CEMS_Leave__c> getLeaveRecords(string loginEmail){
        return [SELECT Id, Name, CEMS_Leave_End_Date__c,Emp_Email__c ,CEMS_Total_Leaves__c,CEMS_Leave_Start_Date__c,Granted_Advanced_Leave__c,Granted_Bereavement_Leave__c,Granted_Paid_Leaves__c,CEMS_Employee__r.Name, CEMS_Leave_Status__c, CEMS_Reason__c, CEMS_Type_Of_Leave__c FROM CEMS_Leave__c where  CEMS_Employee__r.cems_work_email__C =:loginEmail];
    }
  @AuraEnabled(cacheable=true)
    public static List<CEMS_Leave__c> getLeaveRecords2(string loginEmail){
        return [SELECT Id, Name, CEMS_Leave_End_Date__c,Emp_Email__c ,CEMS_Total_Leaves__c,CEMS_Leave_Start_Date__c,Granted_Advanced_Leave__c,Granted_Bereavement_Leave__c,Granted_Paid_Leaves__c,CEMS_Employee__r.Name, CEMS_Leave_Status__c, CEMS_Reason__c, CEMS_Type_Of_Leave__c FROM CEMS_Leave__c where  CEMS_Employee__r.cems_work_email__C =:loginEmail];
    }
@AuraEnabled(cacheable=true)
public static List<CEMS_Job_Application__c> retrieveJobApplications(String jobOpeningId) {
    // Perform a query to retrieve job applications related to the specified job opening
    List<CEMS_Job_Application__c> jobApplications = [
        SELECT Id, Name, CEMS_First_Name__c, CEMS_Last_Name__c, CEMS_Email__c, CEMS_Job_Opening__r.Name, CEMS_Work_Experience__c, CEMS_Company_Name__c 
        FROM CEMS_Job_Application__c 
        WHERE CEMS_Job_Opening__c = :jobOpeningId
    ];
    
    return jobApplications;
}
  public static Map<String, Object> base64ToJson(String base64Data) {
        // Step 1: Decode the Base64 data into a string
        Blob decodedBlob = EncodingUtil.base64Decode(base64Data);
        String decodedString = decodedBlob.toString();
       
        
        
        // Step 2: Parse the decoded string into a JSON object
        Map<String, Object> jsonMap;
        try {
            jsonMap = (Map<String, Object>) JSON.deserializeUntyped(decodedString);
        } catch (Exception e) {
            // Handle any exceptions that might occur during JSON parsing
            System.debug('Error parsing JSON: ' + e.getMessage());
            jsonMap = new Map<String, Object>();
        }
        
        return jsonMap;
    }
    
    /*String base64Data = 'JVBERi0xLjcNCiW1tbW1DQoxIDAgb2JqDQo8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFIvTGFuZyhlbikgL1N0cnVjdFRyZWVSb290IDQwIDAgUi9NYXJrSW5mbzw8L01hcmtlZCB0cnVlPj4vTWV0YWRhdGEgMjIxIDAgUi9WaWV3ZXJQcmVmZXJlbmNlcyAyMjIgMCBSPj4NCmVuZG9iag0KMiAwIG9iag0KPDwvVHlwZS9QYWdlcy9Db3VudCAyL0tpZHNbIDMgMCBSIDM1IDAgUl0gPj4NCmVuZG9iag0KMyAwIG9iag0KPDwvVHlwZS9QYWdlL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNSAwIFIvRjIgMTIgMCBSL0YzIDE3IDAgUi9GNCAyMiAwIFIvRjUgMjQgMCBSL0Y2IDI5IDAgUi9GNyAzMSAwIFIvRjggMzMgMCBSPj4vRXh0R1N0YXRlPDwvR1MxMCAxMCAwIFIvR1MxMSAxMSAwIFI+Pi9YT2JqZWN0PDwvSW1hZ2UxNCAxNCAwIFIvSW1hZ2UxNiAxNiAwIFI';
Map<String, Object> jsonData = RegistrationForm.base64ToJson(base64Data);

 

// Now you can work with the JSON data as a Map
System.debug(jsonData);*/

}