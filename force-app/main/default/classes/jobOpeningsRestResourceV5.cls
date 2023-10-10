@RestResource(urlMapping='/JobOpening/v5/*')
global class jobOpeningsRestResourceV5 {
    @HttpGet
    global static void getJobOpeningDetails() {
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;

        try {
            String encodedJobOpeningName = req.requestURI.substring(req.requestURI.lastIndexOf('/') + 1);
            String jobOpeningName = EncodingUtil.urlDecode(encodedJobOpeningName, 'UTF-8');

            Integer pageNumber = 1; // Default page number
            Integer pageSize = 10;  // Default page size (10 records per page)
            String searchKeyword = req.params.get('q'); // Search keyword parameter

            // Check if pagination parameters are provided in the request
            String pageParam = req.params.get('page');
            String sizeParam = req.params.get('size');

            if (pageParam != null) {
                pageNumber = Integer.valueOf(pageParam);
            }

            if (sizeParam != null) {
                pageSize = Integer.valueOf(sizeParam);
            }

            // Log input parameters for debugging
            System.debug('Input Parameters - Job Opening Name: ' + jobOpeningName + ', Page Number: ' + pageNumber + ', Page Size: ' + pageSize + ', Search Keyword: ' + searchKeyword);

            // Updated method call to include the search keyword
            List<JobOpeningsVO5> jobOpeningsList = JobOpeningsHelperV5.getPaginatedJobOpeningDetails(pageNumber, pageSize, searchKeyword);

            if (!jobOpeningsList.isEmpty()) {
                Integer totalRecords;
                if (String.isNotBlank(searchKeyword)) {
                    // If a search keyword is provided, perform the query with a WHERE clause to get the total count
                    totalRecords = [SELECT COUNT() FROM CEMS_job_opening__c WHERE Name LIKE :('%' + searchKeyword + '%')];
                } else {
                    // If no search keyword, use the original query to get the total count
                    totalRecords = JobOpeningsHelperV5.getTotalJobOpenings();
                }

                // Log pagination information for debugging
                System.debug('Pagination Info - Page Number: ' + pageNumber + ', Page Size: ' + pageSize + ', Total Records: ' + totalRecords);
 
                // Build the response object
                JobOpeningsVO5.JobOpening response = new JobOpeningsVO5.JobOpening();
                response.jobOpenings = jobOpeningsList;
                response.totalRecords = totalRecords;
                response.page = pageNumber;
                response.size = pageSize;

                res.statusCode = 200; // Success status code
                res.responseBody = Blob.valueOf(JSON.serialize(response));
        } else {
                // Log when no job openings are found for debugging
                System.debug('No Job Openings Found');

                res.statusCode = 404; // Not Found status code
                res.responseBody = Blob.valueOf(JSON.serialize(new List<String> { 'No Job Openings Found' }));
            }
        } catch (Exception e) {
            // Log the exception for debugging
            System.debug('Exception Occurred: ' + e.getMessage());

            res.statusCode = 500; // Internal Server Error status code
            res.responseBody = Blob.valueOf(JSON.serialize(new List<String>{ e.getMessage() }));
        }
    }
}