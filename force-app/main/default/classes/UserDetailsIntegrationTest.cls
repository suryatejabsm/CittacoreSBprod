@isTest
private class UserDetailsIntegrationTest {
    @isTest
    static void testBadRequest() {
        // Test case: No email provided, expect 400 Bad Request
        RestRequest request = new RestRequest();
        RestResponse response = new RestResponse();
        request.requestURI = '/Personnel2/v2/';
        Test.startTest();
        RestContext.request = request;
        RestContext.response = response;
        UserDetailsRestResource.details();
        Test.stopTest();

        System.assertEquals(400, response.statusCode, 'Test case: Expected status code 400');
        Map<String, Object> expectedError = new Map<String, Object>{ 'error' => 'Please provide an email Id' };
        Map<String, Object> actualResponse = (Map<String, Object>)JSON.deserializeUntyped(response.responseBody.toString());
        System.assertEquals(expectedError, actualResponse, 'Test case: Response body does not match');
    }
      @isTest
    static void testInvalidEmailFormat() {
        // Test case: Invalid email format, expect 400 Bad Request
        RestRequest request = new RestRequest();
        RestResponse response = new RestResponse();
        request.requestURI = '/Personnel2/v2/kanna@'; // Provide an invalid email format
        Test.startTest();
        RestContext.request = request;
        RestContext.response = response;
        UserDetailsRestResource.details();
        Test.stopTest();

        System.assertEquals(404, response.statusCode, 'Test case: Expected status code 404');
        Map<String, Object> expectedError = new Map<String, Object>{ 'error' => 'Invalid email format.' };
        Map<String, Object> actualResponse = (Map<String, Object>)JSON.deserializeUntyped(response.responseBody.toString());
        System.assertEquals(expectedError, actualResponse, 'Test case: Response body does not match');
    }
    
      @isTest
    static void testUserNotFound() {
        // Test case: Email provided, but user details not found, expect 404 Not Found
        RestRequest request = new RestRequest();
        RestResponse response = new RestResponse();
        request.requestURI = '/Personnel2/v2/test@example.com'; // Replace 'test@example.com' with a non-existent email
        Test.startTest();
        RestContext.request = request;
        RestContext.response = response;
        UserDetailsRestResource.details();
        Test.stopTest();

        System.assertEquals(404, response.statusCode, 'Test case: Expected status code 404');
        Map<String, Object> expectedError = new Map<String, Object>{ 'error' => 'User with the provided email not found in the database.' };
        Map<String, Object> actualResponse = (Map<String, Object>)JSON.deserializeUntyped(response.responseBody.toString());
        System.assertEquals(expectedError, actualResponse, 'Test case: Response body does not match');
    }
    
    
    @isTest
    static void testUserFound() {
        // Test case: Email provided, user details found, expect 200 OK
        // Create a test CEMS_Personnel__c record with the provided email

        CEMS_Personnel__c testPersonnel = new CEMS_Personnel__c(
            Name = 'Test User',
            CEMS_Work_Email__c = 'test_user@example.com',
            CEMS_Personal_Email__c ='testuser@gmail.com',
            CEMS_Position__c ='salesforce Developer',
            CEMS_Email__c='test@gmail.com',
            CEMS_HR_Manager__c='Nalin',
           RecordTypeId = '012DO0000008XfDYAU'
            
            // Add other required fields here
        );
        insert testPersonnel;

        // Call userDetailsHelperClass to retrieve user details
        userInformationVo expectedUserDetails = new userInformationVo();
        expectedUserDetails.Name = 'Test User';
        expectedUserDetails.WorkEmail = 'test_user@example.com';
        expectedUserDetails.Email ='test@gmail.com';
        expectedUserDetails.Position ='Salesforce Developer';
        expectedUserDetails.PersonalEmail='test1@gmail.com';
        expectedUserDetails.HRManager='Nalin';
        // Set other expected user details in the 'expectedUserDetails' object

        RestRequest request = new RestRequest();
        RestResponse response = new RestResponse();
        request.requestURI = '/Personnel2/v2/test_user@example.com';
        Test.startTest();
        RestContext.request = request;
        RestContext.response = response;
        UserDetailsRestResource.details();
        Test.stopTest();

        System.assertEquals(200, response.statusCode, 'Test case: Expected status code 200');
        userInformationVo actualUserDetails = (userInformationVo)JSON.deserialize(response.responseBody.toString(), userInformationVo.class);
        System.assertEquals(expectedUserDetails, actualUserDetails, 'Test case: Response body does not match');
    }

   







    
    
  
}