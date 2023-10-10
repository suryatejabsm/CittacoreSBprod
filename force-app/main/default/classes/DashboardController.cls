public with sharing class DashboardController {
    @AuraEnabled(cacheable=true)
    public static String getDashboardUrl() {
        Dashboard dashboard = [SELECT Id, FolderName, Title, DeveloperName, Type FROM Dashboard WHERE DeveloperName = 'LRNorKJNugQgqYgvdwRuuTowwgpfrZ1'];
        return '/lightning/r/Dashboard/01ZDO0000000DCZ2A2/view';
    }
}