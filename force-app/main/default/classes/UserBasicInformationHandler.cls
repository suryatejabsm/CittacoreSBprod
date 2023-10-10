global class UserBasicInformationHandler {
    // Custom exception classes
    public class StringException extends Exception {}
    public class UserNotFoundException extends Exception {}

    // Method to get user basic information based on the provided email
    public Map<String, Object> getUserBasicInformation(String userEmailId) {
        // Initialize the response data
        UserInformationVOClass responseData = new UserInformationVOClass();

        // Fetch the required fields only instead of all fields for matching personnel
        List<CEMS_Personnel__c> matchingPersonnels = [
            SELECT Id, Name, RecordTypeId, CEMS_Work_Email__c, CEMS_Personal_Email__c, CEMS_Email__c, CEMS_Company_Name__c, CEMS_Contact_Number__c,
                CEMS_Type__c, CEMS_Rating__c, CEMS_Mobile__c, CEMSAddress__c, CEMS_HR_Manager__r.Name, CEMS_Current_Salary__c, CEMS_Work_Location__c,
                CEMS_Current_Level__c, CEMS_Date_of_Birth__c, CEMS_Education__c, CEMS_Employee_ID__c, CEMS_Highest_Degree__c,
                CEMS_Joined_Date__c, CEMS_Experience__c, CEMS_Bench__c, CEMS_Position__r.Name, CEMS_Project_Manager__r.Name, CEMS_Recruiting_Manager__r.Name,
                CEMS_Reporting_Director__r.Name, CEMS_Reporting_Manager__r.Name, CEMS_Required_Documents_to_Upload__c, CEMS_Resource_Manager__r.Name
            FROM CEMS_Personnel__c
            WHERE CEMS_Work_Email__c = :userEmailId OR CEMS_Personal_Email__c = :userEmailId OR CEMS_Email__c = :userEmailId
        ];

        if (matchingPersonnels.isEmpty()) {
            UserBasicInformationHandler.UserNotFoundException ex = new UserBasicInformationHandler.UserNotFoundException();
            ex.setMessage('Email not found. Please try with another email.');
            throw ex;
        }

        // Handle multiple matches scenario if needed (In this code, it takes the first matching personnel)
        CEMS_Personnel__c matchedPersonnel = matchingPersonnels[0];

        // Populate the response data with the matched personnel's fields
        responseData.Name = matchedPersonnel.Name;
        responseData.WorkEmail = matchedPersonnel.CEMS_Work_Email__c;
        responseData.PersonalEmail = matchedPersonnel.CEMS_Personal_Email__c;
        responseData.Rating = matchedPersonnel.CEMS_Rating__c;
        responseData.EmploymentType = matchedPersonnel.CEMS_Type__c;
        responseData.Address = matchedPersonnel.CEMSAddress__c;
        responseData.Bench = matchedPersonnel.CEMS_Bench__c;
        responseData.ContactNumber = matchedPersonnel.CEMS_Contact_Number__c;
        responseData.CurrentLevel = matchedPersonnel.CEMS_Current_Level__c;
        responseData.CurrentSalary = matchedPersonnel.CEMS_Current_Salary__c;
        responseData.DateofBirth = matchedPersonnel.CEMS_Date_of_Birth__c;
        responseData.EmployeeID = matchedPersonnel.CEMS_Employee_ID__c;
        responseData.WorkLocation = matchedPersonnel.CEMS_Work_Location__c;
        responseData.JoinedDate = matchedPersonnel.CEMS_Joined_Date__c;
        responseData.RequiredDocumentsToUpload = matchedPersonnel.CEMS_Required_Documents_to_Upload__c;
        responseData.ProjectManager = matchedPersonnel.CEMS_Project_Manager__r.Name;
        responseData.RecrutingManager = matchedPersonnel.CEMS_Recruiting_Manager__r.Name;
        responseData.ResourceManager = matchedPersonnel.CEMS_Resource_Manager__r.Name;
        responseData.ReportingDirector = matchedPersonnel.CEMS_Reporting_Director__r.Name;
        responseData.ReportingManager = matchedPersonnel.CEMS_Reporting_Manager__r.Name;
        responseData.Position = matchedPersonnel.CEMS_Position__r.Name;
        responseData.HRManager = matchedPersonnel.CEMS_HR_Manager__r.Name;

        // Set the user type based on RecordTypeId
        ID applicantRecordTypeId = [SELECT Id FROM RecordType WHERE Name='Applicant' AND SobjectType = 'CEMS_Personnel__c' LIMIT 1].Id;
        if (matchedPersonnel.RecordTypeId == applicantRecordTypeId) {
            responseData.userType = 'APPLICANT';
        } else {
            responseData.userType = 'EMPLOYEE';
        }

        // Convert the UserInformationVOClass object to a Map<String, Object>
        return (Map<String, Object>) JSON.deserializeUntyped(JSON.serialize(responseData));
    }

}

    // Method to handle a bad request by setting the status code and response body accordingly
    /*public void handleBadRequest(RestResponse res, String errorMessage) {
        res.statusCode = 400;
        res.responseBody = Blob.valueOf(JSON.serialize(new List<String>{errorMessage}));
    }

    // Method to handle the scenario when the user is not found by setting the status code and response body accordingly
    public void handleUserNotFound(RestResponse res, String errorMessage) {
        res.statusCode = 404;
        res.responseBody = Blob.valueOf(JSON.serialize(new List<String>{errorMessage}));
    }

    // Method to handle internal server errors by setting the status code and response body accordingly
    public void handleInternalServerError(RestResponse res) {
        res.statusCode = 500;
        res.responseBody = Blob.valueOf(JSON.serialize(new List<String>{'An unexpected error occurred'}));
    }*/




















/*
global class UserBasicInformationHandler {
    public class StringException extends Exception {}
    public class UserNotFoundException extends Exception {}
    

    public Map<String, Object> getUserBasicInformation(String userEmailId) {
        List<String> errorMessages = new List<String>();
        Map<String, Object> responseData = new Map<String, Object>();

        // Check if the user email exists in our SF system and determine user type
       List<CEMS_Personnel__c> matchingPersonnels = [
    SELECT Id, Name, RecordTypeId, CEMS_Work_Email__c, CEMS_Personal_Email__c, CEMS_Email__c, CEMS_Company_Name__c, CEMS_Contact_Number__c,
        CEMS_Experience__c, CEMS_Work_Location__c, CEMS_Years_Of_Experience__c, CEMS_Type__c, CEMS_Rating__c, CEMS_Mobile__c, CEMSAddress__c 
    FROM CEMS_Personnel__c
    WHERE CEMS_Work_Email__c = :userEmailId OR CEMS_Personal_Email__c = :userEmailId OR CEMS_Email__c = :userEmailId
    LIMIT 1
];


        if (matchingPersonnels.isEmpty()) {
        UserBasicInformationHandler.UserNotFoundException ex = new UserBasicInformationHandler.UserNotFoundException();
        ex.setMessage('Email not found. Please try with another email.');
        throw ex;
        } else {
            CEMS_Personnel__c matchedPersonnel = matchingPersonnels[0];
            responseData.put('Id', matchedPersonnel.Id);
            responseData.put('Name', matchedPersonnel.Name);
            responseData.put('RecordTypeId', matchedPersonnel.RecordTypeId);
            responseData.put('CEMS_Work_Email__c', matchedPersonnel.CEMS_Work_Email__c);
            responseData.put('CEMS_Personal_Email__c', matchedPersonnel.CEMS_Personal_Email__c);
            responseData.put('CEMS_Email__c', matchedPersonnel.CEMS_Email__c);
            responseData.put('CEMS_Company_Name__c', matchedPersonnel.CEMS_Company_Name__c);
            responseData.put('CEMS_Contact_Number__c', matchedPersonnel.CEMS_Contact_Number__c);
            responseData.put('CEMS_Experience__c', matchedPersonnel.CEMS_Experience__c);
            responseData.put('CEMS_Work_Location__c', matchedPersonnel.CEMS_Work_Location__c);
            responseData.put('CEMS_Years_Of_Experience__c', matchedPersonnel.CEMS_Years_Of_Experience__c);
            responseData.put('CEMS_Type__c', matchedPersonnel.CEMS_Type__c);
            responseData.put('CEMS_Rating__c', matchedPersonnel.CEMS_Rating__c);
            responseData.put('CEMS_Mobile__c', matchedPersonnel.CEMS_Mobile__c);
            responseData.put('CEMSAddress__c', matchedPersonnel.CEMSAddress__c);
            
        }

        return responseData;
    }

    public  void handleBadRequest(RestResponse res, String errorMessage) {
        res.statusCode = 400;
        res.responseBody = Blob.valueOf(JSON.serialize(new List<String>{errorMessage}));
    }

    public  void handleUserNotFound(RestResponse res, String errorMessage) {
        res.statusCode = 404;
        res.responseBody = Blob.valueOf(JSON.serialize(new List<String>{errorMessage}));
    }

    public  void handleInternalServerError(RestResponse res) {
        res.statusCode = 500;
        res.responseBody = Blob.valueOf(JSON.serialize(new List<String>{'An unexpected error occurred'}));
    }
}*/

/*
global class UserBasicInformationHandler {
    public class StringException extends Exception {}
    public class UserNotFoundException extends Exception {}
    
    public Map<String, Object> getUserBasicInformation(String userEmailId) {
        List<String> errorMessages = new List<String>();
        Map<String, Object> responseData = new Map<String, Object>();

        // Check if the user email exists in our SF system and determine user type
        List<CEMS_Personnel__c> matchingPersonnels = [
            SELECT Id, Name, RecordTypeId, CEMS_Work_Email__c, CEMS_Personal_Email__c, CEMS_Email__c, CEMS_Company_Name__c, CEMS_Contact_Number__c,
                CEMS_Experience__c, CEMS_Work_Location__c, CEMS_Years_Of_Experience__c, CEMS_Type__c, CEMS_Rating__c, CEMS_Mobile__c, CEMSAddress__c 
            FROM CEMS_Personnel__c
            WHERE CEMS_Work_Email__c = :userEmailId OR CEMS_Personal_Email__c = :userEmailId OR CEMS_Email__c = :userEmailId
            LIMIT 1
        ];

        if (matchingPersonnels.isEmpty()) {
            UserBasicInformationHandler.UserNotFoundException ex = new UserBasicInformationHandler.UserNotFoundException();
            ex.setMessage('Email not found. Please try with another email.');
            throw ex;
        } else {
            CEMS_Personnel__c matchedPersonnel = matchingPersonnels[0];
            responseData = matchedPersonnel.getPopulatedFieldsAsMap();
        }

        return responseData;
    }

    public void handleBadRequest(RestResponse res, String errorMessage) {
        res.statusCode = 400;
        res.responseBody = Blob.valueOf(JSON.serialize(new List<String>{errorMessage}));
    }

    public void handleUserNotFound(RestResponse res, String errorMessage) {
        res.statusCode = 404;
        res.responseBody = Blob.valueOf(JSON.serialize(new List<String>{errorMessage}));
    }

    public void handleInternalServerError(RestResponse res) {
        res.statusCode = 500;
        res.responseBody = Blob.valueOf(JSON.serialize(new List<String>{'An unexpected error occurred'}));
    }
}
*/
/*
global class UserBasicInformationHandler {
    public class StringException extends Exception {}
    public class UserNotFoundException extends Exception {}

    public Map<String, Object> getUserBasicInformation(String userEmailId) {
        Map<String, Object> responseData = new Map<String, Object>();

        // Fetch the required fields only instead of all fields
        List<CEMS_Personnel__c> matchingPersonnels = [
            SELECT Id, Name, CEMS_Work_Email__c, CEMS_Personal_Email__c, CEMS_Email__c, CEMS_Company_Name__c, CEMS_Contact_Number__c,
                CEMS_Type__c, CEMS_Rating__c, CEMS_Mobile__c, CEMSAddress__c 
            FROM CEMS_Personnel__c
            WHERE CEMS_Work_Email__c = :userEmailId OR CEMS_Personal_Email__c = :userEmailId OR CEMS_Email__c = :userEmailId
        ];

        if (matchingPersonnels.isEmpty()) {
            throw new UserNotFoundException('Email not found! Please try with another email.');
        }

        // Handle multiple matches scenario if needed
        CEMS_Personnel__c matchedPersonnel = matchingPersonnels[0];
        responseData = matchedPersonnel.getPopulatedFieldsAsMap();

        return responseData;
    }

    public void handleBadRequest(RestResponse res, String errorMessage) {
        res.statusCode = 400;
        res.responseBody = Blob.valueOf(JSON.serialize(new List<String>{errorMessage}));
    }

    public void handleUserNotFound(RestResponse res, String errorMessage) {
        res.statusCode = 404;
        res.responseBody = Blob.valueOf(JSON.serialize(new List<String>{errorMessage}));
    }

    public void handleInternalServerError(RestResponse res) {
        res.statusCode = 500;
        res.responseBody = Blob.valueOf(JSON.serialize(new List<String>{'An unexpected error occurred'}));
    }
}
*/