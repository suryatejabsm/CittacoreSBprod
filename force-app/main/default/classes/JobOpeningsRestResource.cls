@RestResource(urlMapping='/JobOpening/v1/*')
global class JobOpeningsRestResource {
    @HttpGet
    global static void getJobOpeningDetails() {
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        Integer offSetValue = 0;
        Integer page = 1;
        Integer displaylimit = 10;
        Integer MAX_LIMIT = 20;
        String keyword = '';
        try {


            // Get the pagination and search parameters from the request
            if (req.params.containsKey('page')) {
                page = Integer.valueOf(req.params.get('page'));
            }
            if (req.params.containsKey('limit')) {
                displaylimit = Integer.valueOf(req.params.get('limit'));
            }
            if (req.params.containsKey('keyword')) {
                keyword = EncodingUtil.urlDecode(req.params.get('keyword'), 'UTF-8');
            }

            // Validate the limit to ensure it's not greater than the maximum allowed
            if (displaylimit > MAX_LIMIT) {
                throw new StringException('Limit must be less than or equal to ' + MAX_LIMIT);
            }

             offSetvalue = (page-1)*displaylimit;

			// Call the helper class method to get the job opening details with pagination
            List<JobOpeningsVO> jobOpeningsList = JobOpeningsHelper.getJobOpeningDetails(keyword, displaylimit, offSetValue);
            //add a null check for jobopeningslist 
            if(jobOpeningsList.isEmpty()){
                throw new StringException('No Records Found With The Provided Keyword');
            }
            // Build the response object
            JobOpeningsVO.JobOpening response = new JobOpeningsVO.JobOpening();
            response.jobOpenings = jobOpeningsList;
            response.totalCount = JobOpeningsHelper.getJobOpeningsCount(keyword);
            response.currentPage = (offSetValue / displaylimit) + 1;
            response.displaylimit = displaylimit;

            // Convert the response to JSON format and set it as the response body
            String jsonResponse = JSON.serializePretty(response);


            res.statusCode = 200;
            res.responseBody = Blob.valueOf(jsonResponse);
        } catch (StringException e) {
            res.StatusCode = 400;
            res.responseBody = Blob.valueOf(JSON.serialize(new List<String>{ e.getMessage() }));
        } catch (Exception e) {
            res.StatusCode = 500;
            res.responseBody = Blob.valueOf(JSON.serialize(new List<String>{ e.getMessage() }));
        }
    }
}