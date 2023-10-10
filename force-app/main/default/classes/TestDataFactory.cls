public class TestDataFactory {

    // Method to set up a REST request with the given request URI and parameters
    @TestVisible
    public static RestRequest setupRestRequest(String requestURI, Map<String, String> params) {
        RestRequest req = new RestRequest();
        req.requestURI = requestURI;
        req.params.putAll(params);
        RestContext.request = req;
        return req;
    }

    // Method to set up a REST response
    @TestVisible
    public static RestResponse setupRestResponse() {
        RestResponse res = new RestResponse();
        RestContext.response = res;
        return res;
    }

    // Method to create test data for job openings
    @TestVisible
    public static void createTestData() {
        List<CEMS_job_opening__c> jobOpeningsData = new List<CEMS_job_opening__c>();
        for (Integer i = 0; i < 15; i++) {
            CEMS_job_opening__c jobOpening = new CEMS_job_opening__c(
                Name = 'Job Opening ' + i,
                CEMS_Roles_and_Responsibilities__c = 'Responsibilities for Job ' + i,
                CEMS_Skills__c = 'Configuration ',
                CEMS_Status__c = 'Open',
                CEMS_Technology__c = 'Azure',
                CEMS_Job_Location__c = 'Pune',
                CEMS_Available_Vacancies__c = 3,
                CEMS_Experience__c = '0-2 years'
            );
            jobOpeningsData.add(jobOpening);
        }
        insert jobOpeningsData;
    }

    // Method to create bulk test data for job openings
    @TestVisible
    public static void createBulkData() {
        List<CEMS_job_opening__c> jobOpenings = new List<CEMS_job_opening__c>();
        jobOpenings.add(new CEMS_job_opening__c(
            Name = 'Test Job 1',
            CEMS_Roles_and_Responsibilities__c = 'Test Roles and Responsibilities 1',
            CEMS_Technology__c = 'Azure',
            CEMS_Status__c = 'Open',
            CEMS_Job_Location__c = 'Pune',
            CEMS_Available_Vacancies__c = 5,
            CEMS_Experience__c = '1-2 years'
        ));
        jobOpenings.add(new CEMS_job_opening__c(
            Name = 'Test Job 2',
            CEMS_Roles_and_Responsibilities__c = 'Test Roles and Responsibilities 2',
            CEMS_Technology__c = 'Azure',
            CEMS_Status__c = 'Open',
            CEMS_Job_Location__c = 'Pune',
            CEMS_Available_Vacancies__c = 0,
            CEMS_Experience__c = '1-3 years'
        ));
        insert jobOpenings;
    }
}