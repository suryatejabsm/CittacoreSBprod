public class RestErrorResponse implements IResponse{
    public String status = 'ERROR';
    public String errorCode;
    public String message;
    public RestErrorResponse(){}
    public RestErrorResponse(String errorCode,String message){
        this.errorCode = errorCode;
        this.message = message;
    }
    public String serialize(){
        return JSON.serialize(this);
    }

}