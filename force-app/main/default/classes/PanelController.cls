public with sharing class PanelController {
    @AuraEnabled(cacheable=true)
    public static List<CEMS_Interview_Panel__c> getPanels() {
        System.debug('Fetching panels...');
        List<CEMS_Interview_Panel__c> panels = [SELECT Id, Name, CEMS_Position_Name__r.Name, CEMS_Interviewer_1__r.Name, CEMS_Interviewer_2__r.Name, CEMS_Interviewer_3__r.Name
                                                FROM CEMS_Interview_Panel__c];
        System.debug('Fetched ' + panels.size() + ' panels:');
        for (CEMS_Interview_Panel__c panel : panels) {
            System.debug('Panel Id: ' + panel.Id);
            System.debug('Panel Name: ' + panel.Name);
            System.debug('Position Name: ' + panel.CEMS_Position_Name__r.Name);
            System.debug('Interviewer 1: ' + panel.CEMS_Interviewer_1__r.Name);
            System.debug('Interviewer 2: ' + panel.CEMS_Interviewer_2__r.Name);
            System.debug('Interviewer 3: ' + panel.CEMS_Interviewer_3__r.Name);      
        }
        return panels;
    }
    
    @AuraEnabled
    public static void createPanel(String panelName, String positionName, String interviewer1, String interviewer2, String interviewer3) {
        CEMS_Interview_Panel__c newPanel = new CEMS_Interview_Panel__c();
        newPanel.Name = panelName;
        newPanel.CEMS_Position_Name__c = positionName;
        newPanel.CEMS_Interviewer_1__c = interviewer1;
        newPanel.CEMS_Interviewer_2__c = interviewer2;
        newPanel.CEMS_Interviewer_3__c = interviewer3;
        
        insert newPanel;
    }
    
    @AuraEnabled
    public static void updatePanel(String panelId, String panelName, String positionName, String interviewer1, String interviewer2, String interviewer3) {
        CEMS_Interview_Panel__c panelToUpdate = new CEMS_Interview_Panel__c();
        panelToUpdate.Id = panelId;
        panelToUpdate.Name = panelName;
        panelToUpdate.CEMS_Position_Name__c = positionName;
        panelToUpdate.CEMS_Interviewer_1__c = interviewer1;
        panelToUpdate.CEMS_Interviewer_2__c = interviewer2;
        panelToUpdate.CEMS_Interviewer_3__c = interviewer3;
        
        update panelToUpdate;
    }
    
    @AuraEnabled
    public static void deletePanel(String panelId) {
        CEMS_Interview_Panel__c panelToDelete = new CEMS_Interview_Panel__c();
        panelToDelete.Id = panelId;
        
        delete panelToDelete;
    }
}