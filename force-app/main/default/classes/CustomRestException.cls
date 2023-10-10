public class CustomRestException extends Exception {
    public RestErrorResponse errorResponse;

    public CustomRestException(RestErrorResponse errorResponse) {
        this.errorResponse = errorResponse;
    }
}