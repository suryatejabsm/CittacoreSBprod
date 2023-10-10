public with sharing class InterviewPanelController {
    @AuraEnabled(cacheable=true)
    public static List<CEMS_Interview_Panel__c> getInterviewPanels() {
        List<CEMS_Interview_Panel__c> interviewPanels = [SELECT Id, Name, 
                                                        CEMS_Interviewer_1__r.Name, 
                                                        CEMS_Interviewer_2__r.Name, 
                                                        CEMS_Interviewer_3__r.Name, 
                                                        CEMS_Position_Name__r.Name 
                                                        FROM CEMS_Interview_Panel__c];
        
        // Debugging statements
        for (CEMS_Interview_Panel__c panel : interviewPanels) {
            System.debug('Panel Id: ' + panel.Id);
            System.debug('Panel Name: ' + panel.Name);
            System.debug('Interviewer 1: ' + panel.CEMS_Interviewer_1__r.Name);
            System.debug('Interviewer 2: ' + panel.CEMS_Interviewer_2__r.Name);
            System.debug('Interviewer 3: ' + panel.CEMS_Interviewer_3__r.Name);
            System.debug('Position Name: ' + panel.CEMS_Position_Name__r.Name);
        }
        
        return interviewPanels;
    }
}

/*
public with sharing class InterviewPanelController {
    @AuraEnabled(cacheable=true)
    public static List<CEMS_Interview_Panel__c> getAllInterviewPanels() {
        return [SELECT Id, Name, CEMS_Interviewer_1__r.Name, CEMS_Interviewer_2__r.Name, CEMS_Interviewer_3__r.Name 
                FROM CEMS_Interview_Panel__c];
    }
    
    @AuraEnabled
    public static void updateInterviewPanel(CEMS_Interview_Panel__c panel) {
        update panel;
    }
}*/