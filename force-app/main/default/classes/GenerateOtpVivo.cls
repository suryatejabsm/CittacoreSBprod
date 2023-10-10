public class GenerateOtpVivo {

	public String employeeId;
	public String emailId;
    public String otp;

	
	public static GenerateOtpVivo parse(String json) {
		return (GenerateOtpVivo) System.JSON.deserialize(json, GenerateOtpVivo.class);
	}
}