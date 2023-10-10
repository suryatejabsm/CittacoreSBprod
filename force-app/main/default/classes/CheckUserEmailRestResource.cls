@RestResource(urlMapping='/CheckUserEmail/v1/*')
global class CheckUserEmailRestResource {
    @HttpGet
    global static void checkUserEmail() {
        RestRequest request = RestContext.request;
        RestResponse response = RestContext.response;
        try {
            String email = request.requestURI.substring(request.requestURI.lastIndexOf('/') + 1);
            if (String.isBlank(email)) {
                throw new StringException('Please provide an email Id');
            }
            else if (!isValidEmailFormat(email)) {
            // Valid email address
                 throw new StringException('Invalid email format');
            } 
                       else {
                CheckUserEmailHelperClass.UserInformation userDetails = CheckUserEmailHelperClass.getUserDetails(email);
                if (userDetails != null) {
                    response.statusCode = 200;
                    response.responseBody = Blob.valueOf(JSON.serialize(userDetails));
                } 
                else {
                    response.statusCode = 404; // Not Found
                    response.responseBody = Blob.valueOf('No records found for the provided email');
                }
            }
        } 
        catch (Exception e) {
            response.statusCode = 500; // Internal Server Error
            response.responseBody = Blob.valueOf('An error error occurred: ' + e.getMessage());
        }
    }
    public static Boolean isValidEmailFormat(String email) {
        String emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
        return Pattern.matches(emailPattern, email);
    }
}