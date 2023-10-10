trigger ActivationTest on Account (before insert) {
    Map<String,TriggerDeactivation__c> TestActive = TriggerDeactivation__c.getAll();
    if(!(TestActive.size()>0&&TestActive.get('MakeActive').IsActive__C))
        return;
     
    for(Account acc:Trigger.new){
        acc.Name = acc.Name +' Modified';
    }
  
}