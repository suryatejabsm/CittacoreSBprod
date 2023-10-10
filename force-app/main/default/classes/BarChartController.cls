public class BarChartController {
    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getOpportunities(){
     return [SELECT 
        Name,
        RecordTypeId,
        MAX(CEMS_Job_Opening_ID__c) maxJobOpeningId,
        MAX(CEMS_Recruiting_Manager__c) maxRecruitingManager,
        MAX(CEMS_Minimum_Pay__c) maxMinimumPay,
        MAX(CEMS_Maximum_Pay__c) maxMaximumPay,
        SUM(CEMS_Available_Vacancies__c) totalAvailableVacancies,
        SUM(CEMS_Filled_Vacancies__c) totalFilledVacancies,
        MAX(CEMS_Due_Date__c) maxDueDate,
        MAX(CEMS_Approval_Status__c) maxApprovalStatus,
        MAX(CEMS_Status__c) maxStatus,
       
        MAX(Grade__c) maxGrade,
        MAX(CEMS_Technology__c) maxTechnology,
        MAX(CEMS_Experience__c) maxExperience,
        MAX(CEMS_Job_Location__c) maxJobLocation
    FROM 
        CEMS_Job_Opening__c
    GROUP BY 
        Name,
        RecordTypeId
    LIMIT 100];
    
        // return [SELECT SUM(ExpectedRevenue) expectRevenue, SUM(Amount) amount, StageName stage 
         //FROM Opportunity WHERE StageName NOT IN ('Closed Won') GROUP BY StageName LIMIT 20];
    }
  
}

/*SELECT CEMS_Certificate_Name__c, Certificate_Level__c, CEMS_Resource_URl__c, CEMS_Designated_Days__c, Category__c, CEMS_Description__c, CEMS_Learning_Name__c, CEMS_Mandatory__c, CEMS_Registration_URL__c,RecordTypeId, Name, Id FROM CEMS_Training__c*/
// public class BarChartController {
//     @AuraEnabled(cacheable=true)
//     public static List<AggregateResult> getOpportunities(){
//         return [
    // SELECT 
    //     CEMS_Certificate_Name__c,
    //     Certificate_Level__c,
    //     CEMS_Resource_URl__c,
    //     CEMS_Designated_Days__c,
    //     Category__c,
    //     CEMS_Description__c,
    //     CEMS_Learning_Name__c,
    //     CEMS_Mandatory__c,
    //     CEMS_Registration_URL__c,
    //     RecordTypeId,
    //     Name,
    //     Id
    // FROM 
    //     CEMS_Training__c
//     GROUP BY 
//         CEMS_Certificate_Name__c,
//         Certificate_Level__c,
//         CEMS_Resource_URl__c,
//         CEMS_Designated_Days__c,
//         Category__c,
//         CEMS_Description__c,
//         CEMS_Learning_Name__c,
//         CEMS_Mandatory__c,
//         CEMS_Registration_URL__c,
//         RecordTypeId,
//         Name,
//         Id
// ];
//     }
  
// }