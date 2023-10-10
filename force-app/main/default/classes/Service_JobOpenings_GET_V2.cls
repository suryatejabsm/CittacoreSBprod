public class Service_JobOpenings_GET_V2 implements IWebService {
 	// Properties to hold the parameters for the service
    public String keyword { get; set; }
    public Integer displaylimit { get; set; }
    public Integer page {get; set; }
    public Object result;
    private static final Integer MAX_LIMIT = 20;
	
    // Method to set the parameters for the service
    public IWebService setParams(Map<String, String> params) {
        if (params.containsKey('keyword')) {
            this.keyword = params.get('keyword');
        }
        
        if(params.containsKey('page')){
                this.page = Integer.valueOf(params.get('page'));
              
        }
        if(params.containsKey('limit')){
            this.displaylimit = Integer.valueof(params.get('limit'));
        }
       
        return this;
    }

    public IWebService execute() {
         // If keyword is not provided, set it to an empty string
        if (String.isBlank(this.keyword)) {
            this.keyword = '';
        }

        // If page or limit is not provided, set them to default values
        if (this.page == null) {
            this.page = 1;
        }
        if (this.displaylimit == null) {
            this.displaylimit = MAX_LIMIT; 
        }
        
         // Calculate the offset for pagination
        Integer offSetValue = (page - 1) * displaylimit;
        system.debug('*** this.keyword =  '+this.keyword+' *** this.displaylimit = '+this.displaylimit+ ' ** offSetValue = '+offSetValue);
        
        // Get job opening details using the provided parameters
        this.result =  JobOpeningsHelper.getJobOpeningDetails(this.keyword,this.displaylimit, offSetValue);
        system.debug('result++'+this.result );
        
        // Create a response object to hold the result
        JobOpeningsVO.JobOpening response = new JobOpeningsVO.JobOpening();
        response.jobOpenings = (List<JobOpeningsVO>) this.result;
        response.totalCount = JobOpeningsHelper.getJobOpeningsCount(this.keyword);
        response.currentPage = this.page;
        response.displaylimit = this.displaylimit;
        
        // Serialize the response as JSON
        String jsonResponse = JSON.serialize(response);
        this.result = jsonResponse;

        return this;
    }
	
    public IWebService validate() {
        if(this.displayLimit > MAX_LIMIT){
            throw new customException('limit should not be greater than '+ MAX_LIMIT);
        }
        
        if (!String.isBlank(this.keyword)) {
            Integer count = JobOpeningsHelper.getJobOpeningsCount(this.keyword);
            if (count == 0) {
                throw new CustomException('No records found with the provided keyword.');
            }
        }
        
        return this;
    }

    public Object getResult() {
       return this.result ;
      
    }
    
}