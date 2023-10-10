public class RestSuccessResponsev2 implements IResponse {
     public String status = 'SUCCESS';
    public List<PersonnelVO> response;

    public RestSuccessResponsev2(List<PersonnelVO> response) {
        this.response = response;
    }

    public String serialize() {
        return JSON.serialize(this);
    }
}