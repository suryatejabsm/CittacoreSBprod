public class CreateProjectRecs {
    public static void createRecords() {
        List<CEMS_Employee_Project__c> empProjList = new List<CEMS_Employee_Project__c>();

        // Query CEMS_Personnel__c records with the Employee record type
        List<CEMS_Personnel__c> employeeList = [
            SELECT Id, CEMS_Joined_Date__c 
            FROM CEMS_Personnel__c 
            WHERE RecordType.DeveloperName = 'Employee' 
            LIMIT 100
        ];

        List<CEMS_Projects__c> projectList = [SELECT Id FROM CEMS_Projects__c LIMIT 100]; // Assuming you have at least 100 project records

        for (Integer i = 0; i < 30; i++) {
            CEMS_Employee_Project__c empProj = new CEMS_Employee_Project__c();

            // Randomly select an employee
            Integer randomEmpIndex = Math.mod(Math.abs(Crypto.getRandomInteger()), employeeList.size());
            CEMS_Personnel__c employee = employeeList[randomEmpIndex];
            
            empProj.CEMS_Employee__c = employee.Id;

            // Check if CEMS_Joined_Date__c field is populated
            if (employee.CEMS_Joined_Date__c != null) {
                // Randomly select a project
                Integer randomProjIndex = Math.mod(Math.abs(Crypto.getRandomInteger()), projectList.size());
                empProj.CEMS_Projects__c = projectList[randomProjIndex].Id;

                // Generate random start and end dates
                Date startDate = Date.today().addDays(-Math.mod(Math.abs(Crypto.getRandomInteger()), 30)); // Random date within the last 30 days
                Date endDate = startDate.addDays(Math.mod(Math.abs(Crypto.getRandomInteger()), 60)); // Random date within the next 60 days

                empProj.CEMS_Employee_s_Project_Start_Date__c = startDate;
                empProj.CEMS_Employee_s_Project_End_Date__c = endDate;

                // Check if joining date is less than employee start date
                if (startDate >= employee.CEMS_Joined_Date__c) {
                    // Assign a random project role and responsibility
                    empProj.CEMS_Project_Role__c = 'Role ' + (i + 1);
                    empProj.CEMS_Project_Responsiblity__c = 'Responsibility ' + (i + 1);

                    empProjList.add(empProj);
                }
            }
        }

        insert empProjList;
    }
}