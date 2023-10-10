@RestResource(urlMapping='/userBasicInformation/*')
global class UserBasicInformationRestResource {

    // Regular expression pattern for validating email format
    private static final String EMAIL_REGEX = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';

    // HTTP GET method to retrieve user basic details
    @HttpGet
    global static void getUserBasicDetail() {
        // Get the incoming REST request and response objects
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;

        // Instantiate the UserBasicInformationHandler class to handle user information logic
        UserBasicInformationHandler handler = new UserBasicInformationHandler();

        try {
            // Extract the user email id from the request URL and trim any leading/trailing spaces
            String userEmailId = req.requestURI.substringAfterLast('/').trim();

            // Input validation: Check if the email is blank
            if (String.isBlank(userEmailId)) {
                handleBadRequest(res, 'Please provide an email');
                return;
            } else if (!isValidEmail(userEmailId)) {
                handleBadRequest(res, 'Invalid email format');
                return;
            }

            // Retrieve user basic information using the UserBasicInformationHandler class
            Map<String, Object> responseData = handler.getUserBasicInformation(userEmailId);

            // If the responseData is empty, the user is not found in the system
            if (responseData.isEmpty()) {
                handleUserNotFound(res, 'Email not found. Please try with another email.');
                return;
            }

            // Set the response body and status code with the retrieved user data
            res.statusCode = 200;
            res.responseBody = Blob.valueOf(JSON.serialize(responseData));
        } catch (UserBasicInformationHandler.UserNotFoundException ex) {
            handleUserNotFound(res, ex.getMessage());
        } catch (Exception ex) {
            handleInternalServerError(res);
        }
    }

    // Private method to validate an email using the EMAIL_REGEX pattern
    private static Boolean isValidEmail(String email) {
        return Pattern.matches(EMAIL_REGEX, email) && !email.contains(' ') && !email.contains('__');
    }

    // Method to handle a bad request by setting the status code and response body accordingly
    private static void handleBadRequest(RestResponse res, String errorMessage) {
        res.statusCode = 400;
        res.responseBody = Blob.valueOf(JSON.serialize(new List<String>{errorMessage}));
    }

    // Method to handle the scenario when the user is not found by setting the status code and response body accordingly
    private static void handleUserNotFound(RestResponse res, String errorMessage) {
        res.statusCode = 404;
        res.responseBody = Blob.valueOf(JSON.serialize(new List<String>{errorMessage}));
    }

    // Method to handle internal server errors by setting the status code and response body accordingly
    private static void handleInternalServerError(RestResponse res) {
        res.statusCode = 500;
        res.responseBody = Blob.valueOf(JSON.serialize(new List<String>{'An unexpected error occurred'}));
    }
}


/*
@RestResource(urlMapping='/user/basicInfo/v1/*')
global class UserBasicInformationRestResource {
    @HttpGet
    global static void getUserBasicDetail() {
        UserBasicInformationVO userBasicInformationVO = new UserBasicInformationVO();
        List<String> errorMessages = new List<String>();
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        
        try {
            String userEmailId = req.requestURI.substringAfterLast('/');
            if (String.isBlank(userEmailId)) {
                errorMessages.add('Please provide a user email id');
                throw new StringException();
            } else {
                // Check if the user email exists in our SF system and determine user type
                List<CEMS_Personnel__c> matchingPersonnels = [
                    SELECT Id, Name, RecordTypeId, CEMS_Work_Email__c, CEMS_Personal_Email__c, CEMS_Email__c
                    FROM CEMS_Personnel__c
                    WHERE CEMS_Work_Email__c = :userEmailId OR CEMS_Personal_Email__c = :userEmailId OR CEMS_Email__c = :userEmailId
                    LIMIT 1
                ];

                if (matchingPersonnels.isEmpty()) {
                    errorMessages.add('This user email id is not exist in our system');
                    throw new StringException();
                } else {
                    // We assume that the first matching personnel is the relevant one
                    CEMS_Personnel__c personnel = matchingPersonnels[0];
                    String userType = (personnel.RecordTypeId == 'Employee_Record_Type_Id') ? 'Employee' : 'Applicant';

                    // Write actual logic to fetch user data from the SF
                    // Assume the method helper.getUserInfo(userEmailId) returns the user data

                    // Simulating user data for demonstration purposes
                    UserBasicInformationVO.Address address = new UserBasicInformationVO.Address(
                        '123 Main St', 'Cityville', 'Stateville', 'Countryland', '12345'
                    );
                    userBasicInformationVO = new UserBasicInformationVO(
                        personnel.Id, personnel.Name.split(' ')[0], personnel.Name.split(' ')[1], userType, address
                    );
                }
            }

            // Build the response
            res.statusCode = 200;
            res.responseBody = Blob.valueOf(JSON.serialize(userBasicInformationVO));
        } catch (StringException e) {
            res.statusCode = 400;
            res.responseBody = Blob.valueOf(JSON.serialize(errorMessages));
        } catch (Exception e) {
            res.statusCode = 500;
            errorMessages.add(e.getMessage());
            res.responseBody = Blob.valueOf(JSON.serialize(errorMessages));
        }
    }
}*/

/*
@RestResource(urlMapping='/user/basicInfo/v1/*')
global class UserBasicInformationRestResource {
    @HttpGet
    global static void getUserBasicDetail() {
        List<String> errorMessages = new List<String>();
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;

        try {
            String userEmailId = req.requestURI.substringAfterLast('/');
            if (String.isBlank(userEmailId)) {
                errorMessages.add('Please provide a user email id');
                throw new StringException();
            } else {
                // Check if the user email exists in our SF system and determine user type
                List<CEMS_Personnel__c> matchingPersonnels = [
                    SELECT Id, Name, RecordTypeId, CEMS_Work_Email__c, CEMS_Personal_Email__c, CEMS_Email__c,CEMS_Company_Name__c,CEMS_Contact_Number__c
                    FROM CEMS_Personnel__c
                    WHERE CEMS_Work_Email__c = :userEmailId OR CEMS_Personal_Email__c = :userEmailId OR CEMS_Email__c = :userEmailId
                    LIMIT 1
                ];

                if (matchingPersonnels.isEmpty()) {
                    errorMessages.add('No user found with the provided email id');
                    throw new UserNotFoundException();
                } else {
                    CEMS_Personnel__c matchedPersonnel = matchingPersonnels[0];
                    // You can add more fields from the matchedPersonnel to the response if needed.
                    Map<String, Object> responseData = new Map<String, Object>();
                    responseData.put('Id', matchedPersonnel.Id);
                    responseData.put('Name', matchedPersonnel.Name);
                    responseData.put('RecordTypeId', matchedPersonnel.RecordTypeId);
                    responseData.put('CEMS_Work_Email__c', matchedPersonnel.CEMS_Work_Email__c);
                    responseData.put('CEMS_Personal_Email__c', matchedPersonnel.CEMS_Personal_Email__c);
                    responseData.put('CEMS_Email__c', matchedPersonnel.CEMS_Email__c);
                    responseData.put('CEMS_Company_Name__c', matchedPersonnel.CEMS_Company_Name__c);
                    responseData.put('CEMS_Contact_Number__c', matchedPersonnel.CEMS_Contact_Number__c);
                   
                    // Set the response body and status code
                    res.statusCode = 200;
                    res.responseBody = Blob.valueOf(JSON.serialize(responseData));
                }
            }
        } catch (StringException ex) {
            // Handle StringException
            res.statusCode = 400;
            res.responseBody = Blob.valueOf(JSON.serialize(errorMessages));
        } catch (UserNotFoundException ex) {
            // Handle UserNotFoundException
            res.statusCode = 404;
            res.responseBody = Blob.valueOf(JSON.serialize(errorMessages));
        } catch (Exception ex) {
            // Handle other exceptions
            res.statusCode = 500;
            errorMessages.add('An unexpected error occurred');
            res.responseBody = Blob.valueOf(JSON.serialize(errorMessages));
        }
    }

    public class UserNotFoundException extends Exception {}
}
*//*
@RestResource(urlMapping='/userbasicinformation/*')
global class UserBasicInformationRestResource {

    // Add this helper method in UserBasicInformationRestResource
    private static Boolean isValidEmail(String email) {
        String emailRegex = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
        return Pattern.matches(emailRegex, email) && !email.contains(' ') && !email.contains('__'); // Additional checks for spaces and '__'
    }

    @HttpGet
    global static void getUserBasicDetail() {
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        UserBasicInformationHandler handler = new UserBasicInformationHandler();

        try {
            String userEmailId = req.requestURI.substringAfterLast('/').trim(); // Trim to remove leading/trailing spaces
            if (String.isBlank(userEmailId)) {
                handler.handleBadRequest(res, 'Please provide a user email id');
            } else if (!isValidEmail(userEmailId)) {
                handler.handleBadRequest(res, 'Invalid email format');
            } else {
                // Retrieve user basic information
                Map<String, Object> responseData = handler.getUserBasicInformation(userEmailId);

                // Set the response body and status code
                res.statusCode = 200;
                res.responseBody = Blob.valueOf(JSON.serialize(responseData));
            }
        } catch (UserBasicInformationHandler.UserNotFoundException ex) {
            handler.handleUserNotFound(res, ex.getMessage());
        } catch (Exception ex) {
            handler.handleInternalServerError(res);
        }
    }
}*/
/*
@RestResource(urlMapping='/userbasicinformation/*')
global class UserBasicInformationRestResource {

    private static final String EMAIL_REGEX = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';

    @HttpGet
    global static void getUserBasicDetail() {
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        UserBasicInformationHandler handler = new UserBasicInformationHandler();

        try {
            String userEmailId = req.requestURI.substringAfterLast('/').trim();

            // Input validation
            if (String.isBlank(userEmailId)) {
                handler.handleBadRequest(res, 'Please provide an email');
                return;
            } else if (!isValidEmail(userEmailId)) {
                handler.handleBadRequest(res, 'Invalid email format');
                return;
            }

            // Retrieve user basic information
            Map<String, Object> responseData = handler.getUserBasicInformation(userEmailId);

            if (responseData.isEmpty()) {
                // User not found in the system
                handler.handleUserNotFound(res, 'Email not found. Please try with another email.');
                return;
            }

            // Set the response body and status code
            res.statusCode = 200;
            res.responseBody = Blob.valueOf(JSON.serialize(responseData));
        } catch (UserBasicInformationHandler.UserNotFoundException ex) {
            handler.handleUserNotFound(res, ex.getMessage());
        } catch (Exception ex) {
            handler.handleInternalServerError(res);
        }
    }

    private static Boolean isValidEmail(String email) {
        return Pattern.matches(EMAIL_REGEX, email) && !email.contains(' ') && !email.contains('__');
    }
}
*/