global class JobOpeningsHelperV5 {
    // Method to get the total number of job openings
    @AuraEnabled
    Global static Integer getTotalJobOpenings() {
        Integer totalJobOpenings = [SELECT COUNT() FROM CEMS_job_opening__c];
        System.debug('Total Job Openings: ' + totalJobOpenings);
        return totalJobOpenings;
    }

    // Method to get paginated job opening details with search keyword
    @AuraEnabled
    public static List<JobOpeningsVO5> getPaginatedJobOpeningDetails(Integer pageNumber, Integer pageSize, String keyword) {
        List<JobOpeningsVO5> jobOpeningsList = new List<JobOpeningsVO5>();
        System.debug('msg'+jobOpeningsList);
        Integer totalRecords;

        if (String.isNotBlank(keyword)) {
            // If a search keyword is provided, perform the query with a WHERE clause
            totalRecords = [SELECT COUNT() FROM CEMS_job_opening__c WHERE Name LIKE :('%' + keyword + '%')];
        } else {
            // If no search keyword, use the original query
            totalRecords = getTotalJobOpenings();
        }

        if (totalRecords > 0) {
            Integer totalPages = (totalRecords + pageSize - 1) / pageSize;
            Integer startIndex = (pageNumber - 1) * pageSize;

            List<CEMS_job_opening__c> jobOpenings;
            if (String.isNotBlank(keyword)) {
                // If a search keyword is provided, perform the query with a WHERE clause
                jobOpenings = [
                    SELECT CEMS_Job_Opening_ID__c, Name, CEMS_Roles_and_Responsibilities__c,
                           CEMS_Skills__c, CEMS_Status__c, CEMS_Technology__c,
                           CEMS_Job_Location__c, CEMS_Available_Vacancies__c,
                           CEMS_Experience__c
                    FROM CEMS_job_opening__c
                    WHERE Name LIKE :('%' + keyword + '%')
                    ORDER BY Name
                ];
            } else {
                // If no search keyword, use the original query
                jobOpenings = [
                    SELECT CEMS_Job_Opening_ID__c, Name, CEMS_Roles_and_Responsibilities__c,
                           CEMS_Skills__c, CEMS_Status__c, CEMS_Technology__c,
                           CEMS_Job_Location__c, CEMS_Available_Vacancies__c,
                           CEMS_Experience__c
                    FROM CEMS_job_opening__c
                    ORDER BY Name
                ];
            }

            Integer endIndex = Math.min(startIndex + pageSize, totalRecords);

            System.debug('Retrieved job openings from index ' + startIndex + ' to ' + (endIndex - 1) + '.');

            for (Integer i = startIndex; i < endIndex; i++) {
                CEMS_job_opening__c jobOpening = jobOpenings[i];
                JobOpeningsVO5 JobOpeningsVO5 = new JobOpeningsVO5();
                JobOpeningsVO5.id = jobOpening.CEMS_Job_Opening_ID__c;
                JobOpeningsVO5.jobTitle = jobOpening.Name;
                JobOpeningsVO5.jobDescription = jobOpening.CEMS_Roles_and_Responsibilities__c;
                JobOpeningsVO5.jobType = jobOpening.CEMS_Technology__c;
                JobOpeningsVO5.jobStatus = jobOpening.CEMS_Status__c;
                JobOpeningsVO5.Technology = jobOpening.CEMS_Technology__c;
                JobOpeningsVO5.jobLocation = jobOpening.CEMS_Job_Location__c;
                JobOpeningsVO5.AvailableVacancies = jobOpening.CEMS_Available_Vacancies__c;
                JobOpeningsVO5.Experience = jobOpening.CEMS_Experience__c;
                jobOpeningsList.add(JobOpeningsVO5);
                
              System.debug('msg'+jobOpeningsList);

            }
        }

        return jobOpeningsList;
    }

  

}