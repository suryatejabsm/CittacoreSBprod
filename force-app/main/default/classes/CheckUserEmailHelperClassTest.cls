@isTest
public class CheckUserEmailHelperClassTest {

    @isTest
    public static void testGetUserDetails_UserFound() {
        // Arrange
        String email = 'john.doe@example.com';
        CEMS_Personnel__c user = new CEMS_Personnel__c();
        user.Name = 'John Doe';
        user.CEMS_Personal_Email__c = 'john.doe@example.com';
        user.CEMS_Work_Email__c = 'j.doe@example.com';
        user.CEMS_Position__c = 'Software Engineer';
        insert user;

        // Act
        Test.startTest(); // Start test context
        CheckUserEmailHelperClass.UserInformation actualUser = CheckUserEmailHelperClass.getUserDetails(email);
        Test.stopTest(); // Stop test context

        // Assert
        System.assertNotEquals(null, actualUser);
        System.assertEquals(user.Name, actualUser.name);
        System.assertEquals(user.CEMS_Personal_Email__c, actualUser.personalEmail);
        System.assertEquals(user.CEMS_Work_Email__c, actualUser.workEmail);
        System.assertEquals(user.CEMS_Position__c, actualUser.position);
    }

    @isTest
    public static void testGetUserDetails_UserNotFound() {
        // Arrange
        String email = 'nonexistent@example.com';

        // Act
        Test.startTest(); // Start test context
        CheckUserEmailHelperClass.UserInformation actualUser = CheckUserEmailHelperClass.getUserDetails(email);
        Test.stopTest(); // Stop test context

        // Assert
        System.assertEquals(null, actualUser);
    }
}