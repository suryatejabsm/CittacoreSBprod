public class WebServiceFactoryv2 {
    private static Map<String, Type> serviceMappings;

    static {
        // Initialize the service mappings here
        serviceMappings = new Map<String, Type>();
        //Query the metadata to get the label/name
        list<Service_Mapping__mdt> mappings = [SELECT label, Service_Type__c FROM Service_Mapping__mdt];
       for (Service_Mapping__mdt mapping : mappings) {
            try {
                Type serviceType = Type.forName(mapping.Service_Type__c);
                serviceMappings.put(mapping.Label, serviceType);
            } catch (TypeException e) {
               system.debug('exception occured');
                throw new CustomException(e.getMessage());
            }
        }
    }
   
    public static IWebService getService(String serviceName, Map<String, String> requestData) {
        IWebService service = createService(serviceName);

        if (service == null) {
            throw new InvalidServiceException('Service Not found');
        }
            // Check if the service is an instance of Service_JobOpenings_GET_v2
        if (service instanceof Service_JobOpenings_GET_v2) {
            Service_JobOpenings_GET_v2 jobOpeningsService = (Service_JobOpenings_GET_v2) service;

            // If keyword, page, or limit is not provided, set them to null
            String keyword = requestData.get('keyword');
            String page = requestData.get('page');
            String displaylimit = requestData.get('limit');
            if (String.isBlank(keyword) && String.isBlank(page) && String.isBlank(displaylimit)) {
                jobOpeningsService.keyword = null;
                jobOpeningsService.page = null;
                jobOpeningsService.displaylimit = null;
            }
            // Call setParams and check if it returns null (indicating an error response)
            jobOpeningsService.setParams(requestData);
            
        }
                 return service.setParams(requestData);
    }

    public static IWebService createService(String serviceName) {
        Type serviceType = serviceMappings.get(serviceName);
        if (serviceType != null) {
            return (IWebService) serviceType.newInstance();
        }

        return null;
    }

    public class InvalidServiceException extends Exception {
        
    }
}