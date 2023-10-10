public class Service_UserBasicDetails_GET_v2 implements IWebService {
      public String userEmail { get; set; }
     public Object result;

    public IWebService setParams(Map<String, String> params) {
        if (params.containsKey('useremail')) {
            this.setUserEmail(params.get('useremail'));
        }
        return this;
    }

    public IWebService setUserEmail(String userEmail) {
        this.userEmail = userEmail;
        return this;
    }

    public IWebService execute() {
        this.result =  userDetailsHelperClass.detailsOfUser(this.userEmail);
        system.debug('result++'+this.result );
        return this;
    }

    public IWebService validate() {
        // Implement validation logic if needed
        if (!validateEmailUtility.isValidEmail(this.userEmail)) {
        // If the email is invalid, set the error message and return the userInformation object
            throw new CustomException('Invalid email format.');
         }

        return this;
    }

    public Object getResult() {
       return this.result ;
      
    }

}