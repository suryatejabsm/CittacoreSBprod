@RestResource(urlMapping='/CEMS_Personnel__c/v4/*')
global class checkUser{

    public class CheckUserEmail {
        // Dummy data structure to hold user details
        public String name;
        public String email;
        public String department;
        // Add more fields as needed

        public CheckUserEmail(String name, String email, String department) {
            this.name = name;
            this.email = email;
            this.department = department;
        }
    }

    @HttpGet
    global static void details() {
        RestRequest request = RestContext.request;
        RestResponse response = RestContext.response;
        try {
            String email = request.requestURI.substring(request.requestURI.lastIndexOf('/') + 1);
            if (String.isBlank(email)) {
                response.statusCode = 400; // Bad Request
                response.responseBody = Blob.valueOf('Please Enter Email id');
            } 
            else {
                CheckUserEmail userDetails = detailsOfUser(email);
                if (userDetails != null) {
                    response.statusCode = 200;
                    response.responseBody = Blob.valueOf(JSON.serialize(userDetails));
                } 
                else {
                    response.statusCode = 404; // Not Found
                    response.responseBody = Blob.valueOf('Please Enter a Valid Email Id');
                }
            }
        } catch (Exception e) {
            response.statusCode = 500; // Internal Server Error
            response.responseBody = Blob.valueOf('An error occurred: ' + e.getMessage());
        }
    }

    // Dummy implementation for retrieving user details based on the email
    private static CheckUserEmail detailsOfUser(String email) {
        // In a real implementation, this method should query the database or external service to retrieve user details.
        // For demonstration purposes, we will return dummy data here.

        // Dummy user details data
        Map<String, CheckUserEmail> dummyUserData = new Map<String, CheckUserEmail>{
            'user1@example.com' => new CheckUserEmail('John Doe', 'user1@example.com', 'Sales'),
            'user2@example.com' => new CheckUserEmail('Jane Smith', 'user2@example.com', 'Marketing')
        };

        // Check if the provided email exists in the dummy data
        if (dummyUserData.containsKey(email)) {
            return dummyUserData.get(email);
        } 
        else {
            return null; // If the email does not exist in the dummy data
        }
    }
}