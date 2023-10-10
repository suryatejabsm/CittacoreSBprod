public class MassDeleteRecords {
    public static void deleteAllCEMSResignations() {
        List<CEMS_Resignation__c> resignationsToDelete = [SELECT Id FROM CEMS_Resignation__c];
        if (!resignationsToDelete.isEmpty()) {
            delete resignationsToDelete;
            System.debug('Successfully deleted ' + resignationsToDelete.size() + ' CEMS Resignation records.');
        } else {
            System.debug('No CEMS Resignation records found for deletion.');
        }
    }
}