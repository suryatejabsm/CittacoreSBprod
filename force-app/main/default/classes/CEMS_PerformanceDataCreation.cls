public class CEMS_PerformanceDataCreation 
{
    /*public static void createPerformanceRecords() {
        List<CEMS_Personnel__c> employee = new List<CEMS_Personnel__c> [select Name,ID from CEMS_Personnel__c where Name like '%a2iD%'];
       
       
    


        List<CEMS_Performance__c> performanceList = new List<CEMS_Performance__c>();
        List<CEMS_Personnel__c> employee = new List<CEMS_Personnel__c>();
        
        for (Integer i = 1; i <= 30; i++) {
            CEMS_Performance__c performanceRecord = new CEMS_Performance__c();
            performanceRecord.CEMS_Employee__c='a2iDO0000008zXOYAY';
           // Assign values to the fields
            performanceRecord.Name = 'Performance ' + i;
            //performanceRecord.CEMS_Bonus__c = 'Value 1 ' + i;
            // Add more fields as needed
            
            performanceList.add(performanceRecord);
        }
        
        insert performanceList;
    }*/
    public static void deleteNRecords() {
        List<CEMS_Personnel__c> recordsToDelete = [select Name from CEMS_Personnel__c where Name like '%a2iD%'];
        
        delete recordsToDelete;
    }
      /* @AuraEnabled(cacheable=true)

public static List<CEMS_Job_Opening__c> getJobOpen(String userEmail) {
    List<CEMS_Job_Opening__c> jobOpenings = new List<CEMS_Job_Opening__c>();

    // Step 1: Query the personnel record based on the user's email
    CEMS_Personnel__c personnel = [SELECT Id, CEMS_Personal_Email__c, CEMS_Work_Email__c FROM CEMS_Personnel__c WHERE CEMS_Personal_Email__c = :userEmail OR CEMS_Work_Email__c = :userEmail LIMIT 1];

    if (personnel != null) {
        // Step 2: Check if the personnel record has both personal and work email fields
        if (personnel.CEMS_Personal_Email__c != null && personnel.CEMS_Work_Email__c != null) {
            // Step 3: If both personal and work email fields are present, fetch internal job openings
            jobOpenings = [SELECT Id, Name, RecordTypeId,CEMS_Experience__c,CEMS_Job_Location__c, CEMS_Roles_and_Responsibilities__c, CEMS_Minimum_Pay__c, CEMS_Maximum_Pay__c, CEMS_Available_Vacancies__c, CEMS_Due_Date__c, CEMS_Skills__c, CEMS_Technology__c,CEMS_Approval_Status__c FROM CEMS_Job_Opening__c WHERE CEMS_Approval_Status__c='Approved' AND RecordTypeId='012DO0000008Xd7YAE'];
            system.debug(jobOpenings);
        } else {
            // Step 4: If either personal or work email field is missing, fetch external job openings
            jobOpenings = [SELECT Id, Name, RecordTypeId,CEMS_Experience__c,CEMS_Job_Location__c, CEMS_Roles_and_Responsibilities__c, CEMS_Minimum_Pay__c, CEMS_Maximum_Pay__c, CEMS_Available_Vacancies__c, CEMS_Due_Date__c, CEMS_Skills__c, CEMS_Technology__c,CEMS_Approval_Status__c FROM CEMS_Job_Opening__c WHERE CEMS_Approval_Status__c='Approved'
                          ];
            system.debug(jobOpenings);
        }
    }
    
    return jobOpenings;
}*/

}