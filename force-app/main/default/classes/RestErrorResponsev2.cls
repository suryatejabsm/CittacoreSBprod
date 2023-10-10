public class RestErrorResponsev2 implements IResponse {
    public String status = 'ERROR';
    public String errorCode;
    public String errorMessage;

    public RestErrorResponsev2(String errorCode, String errorMessage) {
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }

    public String serialize() {
        return JSON.serialize(this);
    }
}