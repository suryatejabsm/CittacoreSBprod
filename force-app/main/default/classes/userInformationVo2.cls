global class userInformationVo2 implements UserInformationInterface {
  
    public String ApplicantID { get; set; }
    public String ErrorMessage { get; set; }
    public String ContactNumber {get;set;}
    public string PANCardNumber {get;set;}
    public string Experience {get;set;}
    public string Email {get;set;}
    
       

     // Implement method for error message
    public String getErrorMessage() {
        return ErrorMessage;
    }
    
}