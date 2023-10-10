public class Service_UserBasicDetails_GET implements IWebService{
    
    public String userEmail{get;set;}
    
    
    
    public IWebService setParams(Map<String,String> params){
        if(params.containsKey('useremail')){
            this.setUserEmail(params.get('useremail'));
        }
        return this;
    }
    public IWebService setUserEmail(String userEmail){
        this.userEmail = userEmail;
        return this;
    }
    public IWebService execute(){return null;}
    public IWebService validate(){return null;}
    public Object getResult(){return null;}

}