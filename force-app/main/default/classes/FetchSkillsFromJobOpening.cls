public without sharing class FetchSkillsFromJobOpening {
    
    public class myException extends Exception{}
    @AuraEnabled(cacheable=true)
    public static List<String> skillsFetched(String recordId) {
        System.debug(recordId );
        List<String> skills = new List<String>();
     
        try {

            List<CEMS_Internal_Scheduler__c> interviewRecords = [SELECT Id, Name, 
             CEMS_Interview_Panel__c,
             //CEMS_Position_Name__c,
             CEMS_Job_Application_ID__c,
             CEMS_Interview_Status__c,
             CEMS_Skill_1__c,
             CEMS_Skill_1_comment__c,
             CEMS_Skill_1_Rating__c,
             CEMS_Skill_2__c,
             CEMS_Skill_2_Comment__c,
             CEMS_Skill_2_Rating__c,
             CEMS_Skill_3__c,
             CEMS_Skill_3_Comment__c,
             CEMS_Skill_3_Rating__c,
             
             CEMS_Skill_4_Comment__c,
             CEMS_Skill_4_Rating__c,                                                   
             CEMS_Skill_4__c,
             CEMS_Skill_5_Comment__c,
             CEMS_Skill_5_Rating__c,                                                    
             CEMS_Skill_5__c,
             CEMS_Skill_6__c,
             CEMS_Skill_6_Comment__c,
             CEMS_Skill_6_Rating__c,
             CEMS_Feedback_Comments__c,
             CEMS_IsFeedbackSubmitted__c                                                  
            FROM CEMS_Internal_Scheduler__c
            WHERE Id = :recordId AND RecordType.DeveloperName IN ('CEMS_Client_Interview', 'CEMS_Company_Interview') 
             ];
                
            
            
            System.debug('Interview records: ' + interviewRecords);
            
            Set<String> jobApplicationIds = new Set<String>();
            for (CEMS_Internal_Scheduler__c interview : interviewRecords) {
                jobApplicationIds.add(interview.CEMS_Job_Application_ID__c);
            }
            
            List<CEMS_Job_Application__c> jobApplicationList = [
                SELECT Id, Name, CEMS_Job_Opening__c
                FROM CEMS_Job_Application__c
                WHERE Id = :jobApplicationIds
            ];
            
            System.debug('Job Application records: ' + jobApplicationList);
            
            Set<String> jobOpeningIds = new Set<String>();
            for (CEMS_Job_Application__c jobApplication : jobApplicationList) {
                jobOpeningIds.add(jobApplication.CEMS_Job_Opening__c);
            }
            
            CEMS_Job_Opening__c jobOpening = [
                SELECT Id, Name, CEMS_Skills__c
                FROM CEMS_Job_Opening__c
                WHERE Id = :jobOpeningIds
            ];
            
            System.debug('Job Opening record: ' + jobOpening);
            
            if (jobOpening != null && !String.isEmpty(jobOpening.CEMS_Skills__c)) {
                skills = jobOpening.CEMS_Skills__c.split(';');
                System.debug('Skills from multi-select picklist: ' + skills);
            }
        } catch (Exception e) {
            throw new myException('Record not found'+e.getMessage());
        }
        
 
        return skills;
    }
   

@AuraEnabled
public static void saveRatingsAndComments(List<InterviewRecord> records, String recordId, String feedbackComment) {
    List<CEMS_Internal_Scheduler__c> feedbackList = new List<CEMS_Internal_Scheduler__c>();
    List<String> skills = skillsFetched(recordId);
    Map<Integer, String> skillFieldMap = createSkillFieldMap();

    CEMS_Internal_Scheduler__c feedback = new CEMS_Internal_Scheduler__c(Id = recordId);
   feedback.CEMS_Feedback_Comments__c = feedbackComment; // Save feedback comment
   feedback.CEMS_IsFeedbackSubmitted__c = true; // Set the checkbox field to true
    for (InterviewRecord record : records) {
        String skillName = record.SkillName;
        Integer skillRating = record.SkillRating;
        String skillComment = record.SkillComment;
       // String feedbackComment = record.FeedbackComment;

        if (skills.contains(skillName)) {
            Integer skillIndex = skills.indexOf(skillName) + 1;
            String fieldRating = skillFieldMap.get(skillIndex) + '_Rating__c';
            String fieldComment = 'CEMS_Skill_' + skillIndex + '_Comment__c';
            String fieldSkill = 'CEMS_Skill_' + skillIndex + '__c';
            

            feedback.put(fieldRating, skillRating);
            feedback.put(fieldComment, skillComment);
            feedback.put(fieldSkill, skillName);
            //feedback.put(feedbackComment,FeedbackComment);
        }
    }

    feedbackList.add(feedback);

     
        try {
            // Database update operation...
            Database.SaveResult[] saveResults = Database.update(feedbackList, false);
            for (Database.SaveResult saveResult : saveResults) {
                if (saveResult.isSuccess()) {
                    System.debug('Feedback record updated successfully.');
                    System.debug('Updated record ID: ' + saveResult.getId());
                } else {
                    for (Database.Error error : saveResult.getErrors()) {
                        System.debug('Error updating feedback record: ' + error.getMessage());
                    }
                    throw new AuraHandledException('Error saving ratings and comments.');
                }
            }
        } catch (Exception e) {
            System.debug('Error saving ratings and comments: ' + e.getMessage());
            throw new AuraHandledException('Error saving ratings and comments: ' + e.getMessage());
        } finally {
              System.debug('Cleanup and resource release operations completed.');

        }
    }

    

  private static Map<Integer, String> createSkillFieldMap() {
    Map<Integer, String> skillFieldMap = new Map<Integer, String>();
    skillFieldMap.put(1, 'CEMS_Skill_1');
    skillFieldMap.put(2, 'CEMS_Skill_2');
    skillFieldMap.put(3, 'CEMS_Skill_3');
    skillFieldMap.put(4, 'CEMS_Skill_4');
    skillFieldMap.put(5, 'CEMS_Skill_5');
    skillFieldMap.put(6, 'CEMS_Skill_6');
    skillFieldMap.put(7, 'CEMS_Skill_7');
    
    
    return skillFieldMap;
}



public class InterviewRecord {
    @AuraEnabled
    public String Id { get; set; }
    
    @AuraEnabled
    public String SkillName { get; set; }
    
    @AuraEnabled
    public Integer SkillRating { get; set; } 
    
    @AuraEnabled
    public String SkillComment { get; set; } 
    
    @AuraEnabled
    public String FeedbackComment {get; set;}
}

}