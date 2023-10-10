@isTest
public class JobOpeningsRestResourceV5Test {

    // Test data setup method to create test records and bulk data for testing
    @TestSetup
    static void setupTestData() {
        TestDataFactory.createTestData();
        TestDataFactory.createBulkData();
    }

    // Positive test case for getting job opening details with valid pagination parameters
    @isTest
    static void testGetJobOpeningDetailsPositive() {
        // Create test data for job openings
        TestDataFactory.createTestData();

        Test.startTest();
        // Set up the REST request with page number and page size parameters
        RestRequest req = TestDataFactory.setupRestRequest('/services/apexrest/JobOpening/v5/', new Map<String, String>{
            'page' => '2',
            'size' => '5'
        });
        RestResponse res = TestDataFactory.setupRestResponse();

        // Call the method under test
        jobOpeningsRestResourceV5.getJobOpeningDetails();

        Test.stopTest();

        // Assertions to verify the response
        System.assertEquals(200, res.statusCode, 'Status code should be 200 for success.');
        JobOpeningsVO5.JobOpening response = (JobOpeningsVO5.JobOpening) JSON.deserialize(res.responseBody.toString(), JobOpeningsVO5.JobOpening.class);
        System.assertEquals(5, response.size, 'Page size should be 5 as provided in the request.');
        System.assertEquals(32, response.totalRecords, 'Total records should be 32.');
        System.assertEquals(2, response.page, 'Page number should be 2 as provided in the request.');
        System.assertEquals(5, response.jobOpenings.size(), 'The response should contain 5 job openings as per page size.');
    }

    // Negative test case for getting job opening details with an invalid search keyword
    @isTest
    static void testGetJobOpeningDetailsNegative() {
        Test.startTest();
        // Set up the REST request with an invalid search keyword
        RestRequest req = TestDataFactory.setupRestRequest('/services/apexrest/JobOpening/v5/', new Map<String, String>{
            'q' => 'InvalidSearchKeyword'
        });
        RestResponse res = TestDataFactory.setupRestResponse();

        // Call the method under test
        jobOpeningsRestResourceV5.getJobOpeningDetails();

        Test.stopTest();

        // Assertions to verify the response
        System.assertEquals(404, res.statusCode, 'Status code should be 404 for no job openings found.');
        List<String> response = (List<String>) JSON.deserialize(res.responseBody.toString(), List<String>.class);
        System.assertEquals('No Job Openings Found', response[0], 'The response message should indicate no job openings found.');
    }

    // Test case for getting job opening details with a valid search keyword
    @isTest
    static void testGetJobOpeningDetailsWithSearchKeyword() {
        // Create test data for job openings
        TestDataFactory.createTestData();

        Test.startTest();
        // Set up the REST request with page number, page size, and search keyword parameters
        RestRequest req = TestDataFactory.setupRestRequest('/services/apexrest/JobOpening/v5/', new Map<String, String>{
            'page' => '2',
            'size' => '5',
            'q' => 'Job Opening'
        });
        RestResponse res = TestDataFactory.setupRestResponse();

        // Call the method under test
        jobOpeningsRestResourceV5.getJobOpeningDetails();

        Test.stopTest();

        // Assertions to verify the response
        System.assertEquals(200, res.statusCode, 'Status code should be 200 for success.');
        JobOpeningsVO5.JobOpening response = (JobOpeningsVO5.JobOpening) JSON.deserialize(res.responseBody.toString(), JobOpeningsVO5.JobOpening.class);
        System.assertEquals(5, response.size, 'Page size should be 5 as provided in the request.');
        System.assertEquals(30, response.totalRecords, 'Total records should be 30.');

        String searchKeyword = 'Job Opening';
        Integer totalRecords = [SELECT COUNT() FROM CEMS_job_opening__c WHERE Name LIKE :('%' + searchKeyword + '%')];
        System.assertEquals(totalRecords, response.totalRecords, 'Total records should match the actual count of job openings with the search keyword.');

        System.assertEquals(2, response.page, 'Page number should be 2 as provided in the request.');
        System.assertEquals(5, response.jobOpenings.size(), 'The response should contain 5 job openings as per page size.');
    }

    // Test case for getting paginated job opening details using a helper method
    @isTest
    static void testGetPaginatedJobOpeningDetails() {
        // Create bulk test data for job openings
        TestDataFactory.createBulkData();

        Test.startTest();
        List<JobOpeningsVO5> jobOpeningsList;
        Boolean shouldPass = true;
        if (shouldPass) {
            String searchKeyword = 'Test';
            jobOpeningsList = JobOpeningsHelperV5.getPaginatedJobOpeningDetails(1, 10, searchKeyword);
        } else {
            String searchKeyword = 'NonExistentKeyword';
            jobOpeningsList = JobOpeningsHelperV5.getPaginatedJobOpeningDetails(1, 10, searchKeyword);
        }
        Test.stopTest();

        // Assertions to verify the results based on the test scenario
        if (shouldPass) {
            System.assertNotEquals(null, jobOpeningsList, 'Job openings list is null');
            System.assertEquals(4, jobOpeningsList.size(), 'Job openings list size mismatch');
            System.assertEquals('Test Job 1', jobOpeningsList[0].jobTitle, 'Job title mismatch');
        } else {
            System.assertEquals(0, jobOpeningsList.size(), 'Job openings list should be empty.');
        }
    }

    // Test case for exception handling in the main method
    @isTest
    static void testExceptionHandling() {
        Test.startTest();

        // Test for invalid pagination parameters
        RestRequest req = TestDataFactory.setupRestRequest('/services/apexrest/JobOpening/v5/', new Map<String, String>{
            'page' => 'abc',
            'size' => 'xyz'
        });
        RestResponse res = TestDataFactory.setupRestResponse();

        // Call the method under test
        jobOpeningsRestResourceV5.getJobOpeningDetails();

        // Assertions to verify the response for invalid pagination parameters
        System.assertEquals(500, res.statusCode, 'Status code should be 500 for bad request.');
        List<String> response = (List<String>) JSON.deserialize(res.responseBody.toString(), List<String>.class);
        System.assertEquals('Invalid integer: abc', response[0], 'The response message should indicate invalid pagination parameters.');

        // Test for no job openings found
        req = TestDataFactory.setupRestRequest('/services/apexrest/JobOpening/v5/', new Map<String, String>{
            'q' => 'NonExistentKeyword'
        });
        res = TestDataFactory.setupRestResponse();

        // Call the method under test
        jobOpeningsRestResourceV5.getJobOpeningDetails();

        Test.stopTest();

        // Assertions to verify the response for no job openings found
        System.assertEquals(404, res.statusCode, 'Status code should be 404 for no job openings found.');
        response = (List<String>) JSON.deserialize(res.responseBody.toString(), List<String>.class);
        System.assertEquals('No Job Openings Found', response[0], 'The response message should indicate no job openings found.');

        String searchKeyword = 'NonExistentKeyword';
        Integer totalRecords = [SELECT COUNT() FROM CEMS_job_opening__c WHERE Name LIKE :('%' + searchKeyword + '%')];
        System.assertEquals(0, totalRecords, 'The totalRecords should be 0 as no records match the search keyword.');
    }
}