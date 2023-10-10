public with sharing class CEMSSchedulerController {
    @AuraEnabled(cacheable=true)
    public static List<CEMS_Internal_Scheduler__c> getInterviewData() {
        List<CEMS_Internal_Scheduler__c> interviewRecords = [SELECT Name, 
                                                             CEMS_Interview_End_Time__c,
                                                             CEMS_Interview_Panel__c,
                                                             CEMS_Interview_Panel__r.Name, 
                                                             CEMS_Interview_Round__c, 
                                                              CEMS_Interview_Status__c, 
                                                             CEMS_Interview_Start_Time__c,
                                                             CEMS_IsFeedbackSubmitted__c
                                                             //(SELECT Name FROM CEMS_Interview_Panel__r) 
                                                             FROM CEMS_Internal_Scheduler__c
                                                             WHERE RecordType.DeveloperName IN ('CEMS_Client_Interview', 'CEMS_Company_Interview') 
                                                             WITH SECURITY_ENFORCED];
        System.debug('Interview Records: ' + interviewRecords);
        return interviewRecords;
    }
        @AuraEnabled(cacheable=true)
    public static List<CEMS_Internal_Scheduler__c> getInterviewData2(string loginEmail) {
        
         List<CEMS_Interview_Panel__c> interviewRecords2 = [SELECT Id, CEMS_Interviewer_1__c, CEMS_Interviewer_2__c, CEMS_Interviewer_3__c, CEMS_Position_Name__c, CEMS_Personnel__c FROM CEMS_Interview_Panel__c where CEMS_Interviewer_1__r.CEMS_Work_Email__c  =:loginEmail
                                                            OR
                                                            CEMS_Interviewer_2__r.CEMS_Work_Email__c  =:loginEmail
                                                            OR CEMS_Interviewer_3__r.CEMS_Work_Email__c =:loginEmail ];
        
          List<CEMS_Internal_Scheduler__c> interviewRecords = [SELECT Id, Name, 
                                                             CEMS_Interview_End_Time__c,
                                                             CEMS_Interview_Panel__c,
                                                               CEMS_Interview_Panel__r.Name,
                                                             CEMS_Interview_Round__c, 
                                                              CEMS_Interview_Status__c, 
                                                             CEMS_Interview_Start_Time__c,
                                                               CEMS_IsFeedbackSubmitted__c
                                                             //(SELECT Name FROM CEMS_Interview_Panel__r) 
                                                             FROM CEMS_Internal_Scheduler__c
                                                             WHERE RecordType.DeveloperName IN ('CEMS_Client_Interview', 'CEMS_Company_Interview') AND CEMS_Interview_Panel__c =:interviewRecords2
                                                             WITH SECURITY_ENFORCED];

        system.debug('interviewRecords2'+interviewRecords2);
                system.debug('interviewRecords'+interviewRecords);

        return interviewRecords;
    }
}