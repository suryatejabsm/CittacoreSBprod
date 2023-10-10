global class userInformationVo1 implements UserInformationInterface {
     // Properties for work email
    public String Name { get; set; }
    public String WorkEmail { get; set; }
    public String Position { get; set; }
    public String HRManager { get; set; }
    public String EmployeeID { get; set; }
    public String ErrorMessage { get; set; }


     // Implement method for error message
    public String getErrorMessage() {
        return ErrorMessage;
    }

}