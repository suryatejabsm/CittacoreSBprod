public class WebServiceFactory {
    public static IWebService getService(String serviceName,Map<String,String> requestData) {
        IWebService iservice = createService(serviceName);
        if (iservice == null) {
            Exception e;
            e.setMessage('Service Not found');
            throw e;
        }
        else{
            return iservice;
        }     
    }
    public static IWebService createService(String serviceName){
        if (serviceName.equalsIgnoreCase('UserBasicDetails')) {
            return new Service_UserBasicDetails_GET();
        } else {
            return null;
        }
    }
}