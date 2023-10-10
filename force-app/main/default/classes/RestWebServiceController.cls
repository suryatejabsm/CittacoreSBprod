@RestResource(urlMapping='/v1/cittacore/*')
global class RestWebServiceController{
    @HttpGet
    global static IResponse doGet(){
        return submitRequest();
    }
    @HttpPost
    global static IResponse doPost(){
        return submitRequest();
    }
    
    global static IResponse submitRequest(){
        Object result;
        IWebService service;
        
        RestRequest request =  RestContext.request;
        RestResponse response = RestContext.response;
        
        response.addHeader('Content-Type','application/json');
        

            String serviceName = request.params.get('service');
            try{
                Map<String,String> requestHeadersMap = new Map<String,String>();
                Map<String,String> requestDataMap = new Map<String,String>();
                if(request.requestBody !=null && String.isNotBlank(request.requestBody.toString())){
    Map<String,Object> requestDataUnTypedMap = (Map<String,Object>) JSON.deserializeUntyped(request.requestBody.toString());	
                    for(String dataKey:requestDataUnTypedMap.keySet()){
                        requestDataMap.put(dataKey,(requestDataUnTypedMap.get(dataKey).toString()));
                    }
                }
                else{
                    for(String dataKey:request.params.keySet()){
                        requestDataMap.put(dataKey,request.params.get(dataKey));
                    }
                }
                service = WebServiceFactory.getService(serviceName,requestDataMap);
                service.validate();
                service.execute();
                result = service.getResult();
                IResponse responseData = new RestSuccessResponse(result);
                return responseData;
                
            }
            catch(Exception ex){
                IResponse responseData = new RestErrorResponse('400',ex.getMessage());
                return responseData;
            }
        }
}