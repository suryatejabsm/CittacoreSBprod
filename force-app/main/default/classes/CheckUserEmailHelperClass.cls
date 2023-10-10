public class CheckUserEmailHelperClass {
    public class UserInformation {
        // Define the structure of user information here.
        // For example, you can have fields like Name, Email, etc.
        public String name;
        public String personalEmail;
        public String workEmail;
        public String position;
}
        public static UserInformation getUserDetails(String email) {
        // Implementing the logic to retrieve user details from the CEMS_Personnel__c object
        String query = 'SELECT Id, Name, CEMS_Position__c, CEMS_Personal_Email__c, CEMS_Work_Email__c FROM CEMS_Personnel__c WHERE CEMS_Personal_Email__c = :email OR CEMS_Work_Email__c = :email LIMIT 1';
        CEMS_Personnel__c user = Database.query(query);

        if (user != null) {
            UserInformation userDetails = new UserInformation();
            userDetails.name = user.Name;
            userDetails.personalEmail = user.CEMS_Personal_Email__c;
            userDetails.workEmail = user.CEMS_Work_Email__c;
            userDetails.position = user.CEMS_Position__c;
            
            return userDetails;
        } 
            else
            return null; // User not found.
        }
    }