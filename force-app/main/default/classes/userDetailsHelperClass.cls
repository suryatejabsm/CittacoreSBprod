global class userDetailsHelperClass {
    global static UserInformationInterface detailsOfUser(String email) {
    // Create an instance of the userInformation class to store the details
    userInformationVo1 userdetail1 = new userInformationVo1();
    userInformationVo2 userdetail2 = new userInformationVo2();

    // Validate email format
    if (!validateEmailUtility.isValidEmail(email)) {
        // If the email is invalid, set the error message and return the userInformation object
        userdetail1.ErrorMessage = 'Invalid email format.';
        return userdetail1;
    }

    try {
        // Query the database to retrieve the user details based on the provided email
 list<CEMS_Personnel__c> personnelDetails = [SELECT Id, Name, CEMS_Work_Email__c, CEMS_Type__c, CEMS_Current_Level__c, CEMS_Work_Location__c, 
                                               CEMS_Joined_Date__c, CEMS_Personal_Email__c, CEMS_Contact_Number__c, CEMS_Current_Salary__c, CEMS_Rating__c, 
                                               CEMS_Applicant_ID__c, CEMS_Education__c, CEMS_Mobile__c, CEMS_Email__c, CEMSAddress__Street__s, CEMSAddress__City__s,
                                               CEMSAddress__PostalCode__s, CEMSAddress__StateCode__s, CEMSAddress__CountryCode__s, CEMS_Years_Of_Experience__c,
                                               CEMSAddress__c, CEMS_Required_Documents_to_Upload__c, CEMS_Bench__c, CEMS_Date_of_Birth__c, CEMS_Position__r.Name, 
                                               CEMS_Company_Name__c, CEMS_Experience__c, CEMS_Roles__c, CEMS_PAN_Card_Number__c, CEMS_Board_Of_Qualification__c,
                                                CEMS_Status__c, CEMS_Resource_Manager__c, CEMS_Reporting_Manager__c,
                                               CEMS_Project_Manager__c, CEMS_HR_Manager__r.Name, CEMS_Reporting_Director__c, CEMS_Employee_ID__c, CEMS_Recruiting_Manager__c, CEMS_Please_Upload_Resume__c
                                                FROM CEMS_Personnel__c WHERE CEMS_Email__c = :email OR CEMS_Work_Email__c = :email LIMIT 1];
        // Check if any user details were retrieved
        if (!personnelDetails.isEmpty()) {
            // Populate the userInformation object with the retrieved user details
            CEMS_Personnel__c personnel = personnelDetails[0];

            if (personnel.CEMS_Work_Email__c != null) {
                // Set data for work email
                userdetail1.Name = personnel.Name;
                userdetail1.WorkEmail = personnel.CEMS_Work_Email__c;
                userdetail1.Position = personnel.CEMS_Position__r.Name;
                userdetail1.HRManager = personnel.CEMS_HR_Manager__r.Name;
                userdetail1.EmployeeID = personnel.CEMS_Employee_ID__c;
                system.debug('userdetail1+++' + userdetail1);
                return userdetail1; // Return userdetail1 when work email is not null
            } else {
                // Set data for personal email
                userdetail2.ApplicantID = personnel.CEMS_Applicant_ID__c;
                   userdetail2.ContactNumber = personnel.CEMS_Contact_Number__c;
                   userdetail2.PANCardNumber = personnel.CEMS_PAN_Card_Number__c;
                    userdetail2.Experience = personnel.CEMS_Experience__c;
                	userdetail2.Email = personnel.CEMS_Email__c;
                system.debug('userdetail2+++' + userdetail2);
                return userdetail2; // Return userdetail2 when work email is null
            }
        } else {
            // If no user details were found, set the error message in the userInformation object
         /*   userdetail1.ErrorMessage = 'User with the provided email not found in the database.';
            return userdetail1;*/
            
            throw new CustomException('User with the provided email not found in the database.');
        }
    } catch (Exception e) {
        // If an exception occurs during the retrieval, set the error message in the userInformation object
     //   userdetail1.ErrorMessage = 'An error occurred while fetching user details: ' + e.getMessage();
      //  return userdetail1;
        
        throw new CustomException( 'An error occurred while fetching user details: ' + e.getMessage());
    }
}

}