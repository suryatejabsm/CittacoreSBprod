@isTest
public class testDataJob {
        @isTest
    private static void createTestData1() {
        // Create test data for CEMS_job_opening__c records
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
    @isTest
    static void testGetJobOpeningDetailsPositive2() {
        // Create test data for CEMS_job_opening__c records
        createTestData1();
        Test.startTest();
        // Make a mock REST request to the resource with pagination parameters
        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();
        req.requestURI = '/services/apexrest/JobOpening/v5/';
        req.params.put('page', '2'); // Set page number to 2
        req.params.put('limit', '5'); // Set page size to 5
        req.params.put('keyword','Job Opening');
        RestContext.request = req;
        RestContext.response = res;
        
        jobOpeningsRestResource.getJobOpeningDetails();
        
        Test.stopTest();
        
        // Check the response
        System.assertEquals(200, res.statusCode, 'Status code should be 200 for success.');
        JobOpeningsVO.JobOpening response = (JobOpeningsVO.JobOpening) JSON.deserialize(res.responseBody.toString(), JobOpeningsVO.JobOpening.class);
        System.assertEquals(5, response.displaylimit, 'Page size should be 5 as provided in the request.');
        System.assertEquals(15, response.totalCount, 'Total records should be 15.');
        System.assertEquals(2, response.currentPage, 'Page number should be 2 as provided in the request.');
        System.assertEquals(5, response.jobOpenings.size(), 'The response should contain 5 job openings as per page size.');
        
    } 
    
    
    @isTest
    public static void testGetJobOpeningDetailsNegative3() {
        // Negative scenario testing for getJobOpeningDetails with no records found
        
        // Test data setup (none in this case, as we will test for no records found)
     
        Test.startTest();
        
        // Test the REST API with pagination and keyword
        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();
        req.requestURI = '/services/apexrest/JobOpening/v1/';
        req.params.put('keyword', 'abcd');
        RestContext.request = req;
        RestContext.response = res;
        
        JobOpeningsRestResource.getJobOpeningDetails();
         Test.stopTest();
        
        System.assertEquals(400, res.statusCode, 'Expected a bad request response');
        
         // Parse the JSON response and validate its structure
        String jsonResponse = res.responseBody.toString();
        List<String> errorMessages = (List<String>)JSON.deserialize(jsonResponse, List<String>.class);

        System.assertEquals(1, errorMessages.size(), 'Expected a single error message');
        System.assertEquals('No Records Found With The Provided Keyword', errorMessages[0], 'Incorrect error message');
        
       
    }

    @isTest
    public static void testGetJobOpeningsCount4() {
        // Positive scenario testing for getJobOpeningsCount
        
        // Test data setup
        List<CEMS_job_opening__c> jobOpeningsData = new List<CEMS_job_opening__c>();
        for (Integer i = 0; i < 5; i++) {
             CEMS_job_opening__c jobOpening = new CEMS_job_opening__c();
            jobOpening.Name ='Azure';
            jobOpening.CEMS_Roles_and_Responsibilities__c = 'Responsibilities for Job ' + i;
                jobOpening.CEMS_Skills__c = 'Configuration ';
                jobOpening.CEMS_Status__c = 'Open';
                jobOpening.CEMS_Technology__c = 'Azure';
                jobOpening.CEMS_Job_Location__c = 'Pune';
                jobOpening.CEMS_Available_Vacancies__c = 3;
                jobOpening.CEMS_Experience__c = '0-2 years';
            	jobOpening.RecordTypeId = '012DO0000008Xd7YAE';
            jobOpeningsData.add(jobOpening);
        }
        insert jobOpeningsData;
        Test.startTest();
        // Test the helper method
        Integer count = JobOpeningsHelper.getJobOpeningsCount('Azure');
        System.assertEquals(5, count, 'Expected count of 5 for "Azure" keyword');
        Test.stopTest();
    }
    
 @isTest
    public static void testGetJobOpeningDetailsWithInvalidLimit() {
        // Test with an invalid limit (greater than MAX_LIMIT)
        Integer invalidLimit = 25;

        Test.startTest();
        RestRequest request = new RestRequest();
        request.requestUri = '/services/apexrest/JobOpening/v1';
        request.addParameter('limit', String.valueOf(invalidLimit));
        RestContext.request = request;

        RestResponse response = new RestResponse();
        RestContext.response = response;

        // Call the REST endpoint
        JobOpeningsRestResource.getJobOpeningDetails();

        Test.stopTest();

        // Assert that the response status code is 400 (Bad Request)
        System.assertEquals(400, response.statusCode);
        // Assert that the response contains the expected error message
        System.assert(response.responseBody.toString().contains('Limit must be less than or equal to 20'));
    }
     @isTest
    public static void testGetJobOpeningDetailsWithException() {
        // Test when an exception occurs in the getJobOpeningDetails method
        Test.startTest();
        RestRequest request = new RestRequest();
        request.requestUri = '/services/apexrest/JobOpening/v1';
        // Set an invalid parameter to trigger an exception in the method
        request.addParameter('invalidParam', 'invalidValue');
        RestContext.request = request;

        RestResponse response = new RestResponse();
        RestContext.response = response;

        // Call the REST endpoint
        JobOpeningsRestResource.getJobOpeningDetails();

        Test.stopTest();

        // Assert that the response status code is 500 (Internal Server Error)
        System.assertEquals(500, response.statusCode);
        // Assert that the response contains the exception message
        System.assert(response.responseBody.toString().contains('Invalid parameter'));
        // Add more assertions here to validate the response content if needed
    }
    
}