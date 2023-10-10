trigger SendEmail on CEMS_Leave__c (after insert, after update) {
    if(Trigger.isAfter){
        if(Trigger.isInsert  || Trigger.isUpdate){ 
            //helper class for single email but bulk messages
            //EmailTriggerHelper.sendEmail(trigger.new);
            EmailTriggerHelper.sendEmailCustom(trigger.new);
            
        }
    }
}