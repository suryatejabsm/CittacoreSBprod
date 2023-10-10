@RestResource(urlMapping='/v2/cittacore/*')
global class RestResourceControllerv2 {
    @HttpGet
    global static IResponse doGet() {
        return submitRequest();
    }

    @HttpPost
    global static IResponse doPost() {
        return submitRequest();
    }

    global static IResponse submitRequest() {
        RestRequest request = RestContext.request;
        RestResponse response = RestContext.response;

        response.addHeader('Content-Type', 'application/json');

            String serviceName = request.params.get('service');
            try {
                Map<String, String> requestDataMap = new Map<String, String>();
                if (request.requestBody != null && String.isNotBlank(request.requestBody.toString())) {
                    Map<String, Object> requestDataUnTypedMap = (Map<String, Object>) JSON.deserializeUntyped(request.requestBody.toString());
                    for (String dataKey : requestDataUnTypedMap.keySet()) {
                        requestDataMap.put(dataKey, requestDataUnTypedMap.get(dataKey).toString());
                    }
                } else {
                    for (String dataKey : request.params.keySet()) {
                        requestDataMap.put(dataKey, request.params.get(dataKey));
                    }
                }

                IWebService service = WebServiceFactoryv2.getService(serviceName, requestDataMap);
                service.validate();
                service.execute();
                Object result = service.getResult();
                IResponse responseData = new RestSuccessResponse(result);
                return responseData;
            } catch (CustomException ex) {
                system.debug('****************** ex ='+ex);
                IResponse responseData = new RestErrorResponsev2('400', ex.getMessage());
                response.statusCode = 400;
                response.responseBody = Blob.valueOf(responseData.serialize());
                return responseData; // Return null to indicate no further processing of the request
            } catch (Exception ex){
                IResponse responseData = new RestErrorResponsev2('500', ex.getMessage());
                response.statusCode = 500;
                response.responseBody = Blob.valueOf(responseData.serialize());
                return responseData;
            }
        }
   
}