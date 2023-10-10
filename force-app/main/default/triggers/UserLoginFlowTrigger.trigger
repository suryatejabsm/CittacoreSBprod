trigger UserLoginFlowTrigger on CEMS_User_Login__c (after insert) {
    if(Trigger.isAfter && Trigger.isInsert){
        for(CEMS_User_Login__c userLogin : Trigger.new){      
            Map<String, String> params = new Map<String, String>();
            params.put('UserId', userLogin.Id);
            Flow.Interview.Send_User_OTP_on_Login_External myFlow = new Flow.Interview.Send_User_OTP_on_Login_External(params);
            myFlow.start();
        }
    }
}