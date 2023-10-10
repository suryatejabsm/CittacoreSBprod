public class JobOpeningsHelper {
    public static Integer getJobOpeningsCount(String keyword){
        Integer count = 0;
        String query = 'SELECT Count(id) totalCount FROM CEMS_job_opening__c ';
        if(!String.isBlank(keyword)) query =  query + ' WHERE Name LIKE \'%'+String.escapeSingleQuotes(keyword)+'%\'';
        system.debug('*** query = '+query);
        AggregateResult ar =  Database.query(query); 
        if(ar!=null){
            count = Integer.valueOf(ar.get('totalCount'));
        }
        return count;
    }
    public static List<jobOpeningsVO> getJobOpeningDetails(String keyword, Integer displaylimit, Integer offSetvalue) {
          List<jobOpeningsVO> jobOpenings = new List<JobOpeningsVO>();
         system.debug('*** keyword = '+keyword);
        system.debug('*** displaylimit = '+displaylimit);
        system.debug('*** offSetvalue = '+offSetvalue);
        // Build the SOQL query based on the search keyword (if provided)
        String query = 'SELECT CEMS_Job_Opening_ID__c, Name, CEMS_Roles_and_Responsibilities__c, ' +
                       'CEMS_Skills__c, CEMS_Status__c, CEMS_Technology__c, CEMS_Job_Location__c, ' +
                       'CEMS_Available_Vacancies__c, CEMS_Experience__c FROM CEMS_job_opening__c';
        if (!String.isBlank(keyword)) {
            query += ' WHERE Name LIKE \'%' + String.escapeSingleQuotes(keyword) + '%\'';
        }

        query += ' LIMIT ' + displaylimit + ' OFFSET ' + offSetvalue;
          system.debug('*** query = '+query);
        List<CEMS_job_opening__c> jobOpeningsList = Database.query(query);

        // Populate the jobOpeningsList with JobOpeningsVO objects
        for (CEMS_job_opening__c jobOpening : jobOpeningsList) {
            JobOpeningsVO jobOpeningsVO = new JobOpeningsVO();
            jobOpeningsVO.id = jobOpening.CEMS_Job_Opening_ID__c;
            jobOpeningsVO.jobTitle = jobOpening.Name;
            jobOpeningsVO.jobDescription = jobOpening.CEMS_Roles_and_Responsibilities__c;
            jobOpeningsVO.jobType = jobOpening.CEMS_Technology__c;
            jobOpeningsVO.jobStatus = jobOpening.CEMS_Status__c;
            jobOpeningsVO.Technology = jobOpening.CEMS_Technology__c;
            jobOpeningsVO.jobLocation = jobOpening.CEMS_Job_Location__c;
            jobOpeningsVO.AvailableVacancies = jobOpening.CEMS_Available_Vacancies__c;
            jobOpeningsVO.Experience = jobOpening.CEMS_Experience__c;
            jobOpenings.add(jobOpeningsVO);
        }
        
        if(jobOpenings.isEmpty() && offsetvalue == 0){
            //throw string exception that records not found
			return new List<JobOpeningsVO>();      
        }
        
        return jobOpenings;
    }
}