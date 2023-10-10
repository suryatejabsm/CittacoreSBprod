trigger CountTrigger on Account (before insert, before Update) {

    for (Account acc : Trigger.new) {
        if (Trigger.isInsert || acc.count__c == null) {
            acc.count__c = 1; // Set count to 1 for new records or if count is null
        } else {
            acc.count__c = acc.count__c + 1; // Increment count for updated records
        }
    }
}