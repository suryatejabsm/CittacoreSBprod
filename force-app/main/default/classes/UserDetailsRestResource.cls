// maps the URL endpoint for the REST service.
@RestResource(urlMapping='/Personnel2/v2/*')
global class UserDetailsRestResource {
    //handle HTTP GET requests.
    @HttpGet
    global static void details() {
        //retrieves the current REST request object && response object.
        RestRequest request = RestContext.request;
        RestResponse response = RestContext.response;
        try {
            // Extract email parameter from the URL
            String email = request.requestURI.substring(request.requestURI.lastIndexOf('/') + 1);
               // Check if the email is blank
            if (String.isBlank(email)) {
                 // If email is not provided, return 400 Bad Request
                handleResponse(response, new Map<String, Object>{ 'error' => 'Please provide an email Id' }, 400);
                return;
            }
            else {
                // Call userDetailsHelperClass to retrieve user information
               UserInformationInterface userDetails12 = userDetailsHelperClass.detailsOfUser(email);
                system.debug('userDetailsvo++'+userDetails12);
                if (userDetails12.getErrorMessage() != null) {
                     // If there's an error in user details, return 404 Not Found
                    handleResponse(response, new Map<String, Object>{ 'error' => userDetails12.getErrorMessage()}, 404);
                } else {
                    // If user details are retrieved successfully, return 200 OK
                    handleResponse(response, userDetails12, 200); 
                }
            }
        } catch (Exception e) {
             // If an exception occurs, return 500 Internal Server Error
            handleResponse(response, new Map<String, Object>{ 'error' => 'An error occurred: ' + e.getMessage() }, 500);
        }
    }
  // Method to handle generating the REST response
    private static void handleResponse(RestResponse response, Object responseObject, Integer statusCode) {
        response.statusCode = statusCode;
        if (statusCode == 200) {
            // Success response, serialize the object to JSON
            response.responseBody = Blob.valueOf(JSON.serialize(responseObject));
        } else {
            // Error response, create a Map with the 'error' key
            response.responseBody = Blob.valueOf(JSON.serialize(responseObject));

        }
    }
}