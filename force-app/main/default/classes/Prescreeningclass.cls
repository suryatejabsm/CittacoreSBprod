public with sharing class Prescreeningclass {
    @AuraEnabled(cacheable=true)
    public static List<CEMS_Job_Application__c> getJobApplication(Id recordId) {
        List<CEMS_Job_Application__c> jobApplications = [
            SELECT Offered_Position__c, CEMS_Email__c, CEMS_First_Name__c, Name
            FROM CEMS_Job_Application__c
            WHERE Id = :recordId
            LIMIT 1
        ];

        return jobApplications;
    }
}