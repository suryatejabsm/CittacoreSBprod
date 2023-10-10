public with sharing class getRecordDataController {
    @AuraEnabled(cacheable=true)
    public static List<Slide__c> getSlides() {
        List<Slide__c> recList = [SELECT Id, Name, image__c,Heading__c,Description__c,altText__c FROM Slide__c];
    return recList;
    }
}