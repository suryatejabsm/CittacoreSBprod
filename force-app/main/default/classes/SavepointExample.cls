public class SavepointExample {
    public static void demoSavepoints() {
        Account acc1 = new Account(Name = 'Account 3');
        Account acc2 = new Account(Name = 'Account 4');
        
        Savepoint sp1 = Database.setSavepoint();        
        try {
            insert acc1;
            
            Savepoint sp2 = Database.setSavepoint();            
            insert acc2;
            
            // Roll back to the first savepoint (SP1)
            Database.rollback(sp1);
        } catch (Exception ex) {
            System.debug('An exception occurred: ' + ex.getMessage());
        }
    }
}