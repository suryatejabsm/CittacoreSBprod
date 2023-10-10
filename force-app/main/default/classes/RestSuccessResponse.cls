public virtual class RestSuccessResponse implements IResponse{
    public String status = 'SUCCESS';
    public Object response;
    public RestSuccessResponse(Object response){
        this.response = response;
    }
    public String serialize(){
        return JSON.serialize(this);
    }
    
    

}