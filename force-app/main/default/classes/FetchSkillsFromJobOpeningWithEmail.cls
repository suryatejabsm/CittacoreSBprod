public with sharing  class FetchSkillsFromJobOpeningWithEmail {
    
    public class InterviewRecord {
        public String skillName;
        public Decimal skillRating;
        public String skillComment;
        
        public InterviewRecord(String skillName, Decimal skillRating, String skillComment) {
            this.skillName = skillName;
            this.skillRating = skillRating;
            this.skillComment = skillComment;
        }
    }
    
    public class myException extends Exception {}
    
    @AuraEnabled(cacheable=true)
    public static List<InterviewRecord> interviewRecordsFetched(String recordId) {
        List<InterviewRecord> interviewRecords = new List<InterviewRecord>();
     
        try {
            List<CEMS_Internal_Scheduler__c> records = [
                SELECT Id, Name, 
                    CEMS_Skill_1__c, CEMS_Skill_1_Rating__c, CEMS_Skill_1_Comment__c,
                    CEMS_Skill_2__c, CEMS_Skill_2_Rating__c, CEMS_Skill_2_Comment__c,
                    CEMS_Skill_3__c, CEMS_Skill_3_Rating__c, CEMS_Skill_3_Comment__c,
                    CEMS_Skill_4__c, CEMS_Skill_4_Rating__c, CEMS_Skill_4_Comment__c,
                    CEMS_Skill_5__c, CEMS_Skill_5_Rating__c, CEMS_Skill_5_Comment__c,
                    CEMS_Skill_6__c, CEMS_Skill_6_Rating__c, CEMS_Skill_6_Comment__c
                FROM CEMS_Internal_Scheduler__c
                WHERE Id = :recordId AND RecordType.DeveloperName IN ('CEMS_Client_Interview', 'CEMS_Company_Interview')
            ];
            
            for (CEMS_Internal_Scheduler__c record : records) {
                System.debug('Skill: ' + record.CEMS_Skill_1__c);
                System.debug('Rating: ' + record.CEMS_Skill_1_Rating__c);
                System.debug('Comment: ' + record.CEMS_Skill_1_Comment__c);
                interviewRecords.add(new InterviewRecord(
                    record.CEMS_Skill_1__c, record.CEMS_Skill_1_Rating__c, record.CEMS_Skill_1_Comment__c));
                
                // Repeat the above debug statements and record creation for each skill field
                System.debug('Skill: ' + record.CEMS_Skill_2__c);
                System.debug('Rating: ' + record.CEMS_Skill_2_Rating__c);
                System.debug('Comment: ' + record.CEMS_Skill_2_Comment__c);
                interviewRecords.add(new InterviewRecord(
                    record.CEMS_Skill_2__c, record.CEMS_Skill_2_Rating__c, record.CEMS_Skill_2_Comment__c));
                
                System.debug('Skill: ' + record.CEMS_Skill_3__c);
                System.debug('Rating: ' + record.CEMS_Skill_3_Rating__c);
                System.debug('Comment: ' + record.CEMS_Skill_3_Comment__c);
                interviewRecords.add(new InterviewRecord(
                    record.CEMS_Skill_3__c, record.CEMS_Skill_3_Rating__c, record.CEMS_Skill_2_Comment__c));
                    
                    
                                    // Repeat the above debug statements and record creation for each skill field
                System.debug('Skill: ' + record.CEMS_Skill_4__c);
                System.debug('Rating: ' + record.CEMS_Skill_4_Rating__c);
                System.debug('Comment: ' + record.CEMS_Skill_4_Comment__c);
                interviewRecords.add(new InterviewRecord(
                    record.CEMS_Skill_4__c, record.CEMS_Skill_4_Rating__c, record.CEMS_Skill_4_Comment__c));
                
                System.debug('Skill: ' + record.CEMS_Skill_5__c);
                System.debug('Rating: ' + record.CEMS_Skill_5_Rating__c);
                System.debug('Comment: ' + record.CEMS_Skill_5_Comment__c);
                interviewRecords.add(new InterviewRecord(
                    record.CEMS_Skill_5__c, record.CEMS_Skill_5_Rating__c, record.CEMS_Skill_5_Comment__c));
                
                System.debug('Skill: ' + record.CEMS_Skill_6__c);
                System.debug('Rating: ' + record.CEMS_Skill_6_Rating__c);
                System.debug('Comment: ' + record.CEMS_Skill_6_Comment__c);
                interviewRecords.add(new InterviewRecord(
                    record.CEMS_Skill_6__c, record.CEMS_Skill_6_Rating__c, record.CEMS_Skill_6_Comment__c));
            }
        } catch (Exception e) {
            throw new myException('Record not found: ' + e.getMessage());
        }
        
        return interviewRecords;
    }
}