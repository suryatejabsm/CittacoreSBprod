/*public class GoogleCloudFunctionService {
    public String getHelloWorld() {
        String functionUrl = 'https://function-1-q26nmmdyeq-el.a.run.app';
        String clientId = '929472627570-fhqqi3nu4bm5mq5lue8v5tojn0pn8ri3.apps.googleusercontent.com'; // Replace with your actual client ID
        String clientSecret = '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'; // Replace with your actual client secret
        String authUri = 'https://accounts.google.com/o/oauth2/auth'; // Replace with your actual auth URI
        String tokenUri = 'https://oauth2.googleapis.com/token'; // Replace with your actual token URI
        String redirectUri = 'https://console.cloud.google.com/apis/credentials?project=winged-math-399709'; // Replace with your actual redirect URI
        String scope = 'https://www.googleapis.com/auth/cloud-platform'; // Adjust the scope based on your Cloud Function's requirements
        
         // Construct the OAuth 2.0 authorization URL
        //String authUrl = authUri;
        system.debug('authUrl'+authUri);
        // Redirect to the authorization URL for user interaction
        PageReference authPage = new PageReference(authUri);
        authPage.setRedirect(true);

        // The user will interact with the authorization server here, and it will eventually redirect back

        // Handle the redirected response, including the authorization code
        String authCode = ApexPages.currentPage().getParameters().get('code');

        if (authCode != null) {
            // The authorization code is now available, so you can exchange it for an access token
            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint(authUri);
            request.setMethod('POST');

            // Set OAuth 2.0 parameters to exchange the authorization code for an access token
            String requestBody = 'code=' + authCode + '&client_id=' + clientId +
                                 '&client_secret=' + clientSecret + '&redirect_uri=' + redirectUri +
                                 '&grant_type=authorization_code';

            request.setBody(requestBody);
            request.setHeader('Content-Type', 'application/x-www-form-urlencoded');

        HttpResponse authResponse = http.send(request);

        if (authResponse.getStatusCode() == 200) {
            // Successfully obtained an access token
            String accessToken = authResponse.getBody();
            
            // Now, make a request to the Google Cloud Function using the access token
            HttpRequest functionRequest = new HttpRequest();
            functionRequest.setEndpoint(functionUrl);
            functionRequest.setMethod('GET');
            
            // Set the access token as a bearer token in the request header
            functionRequest.setHeader('Authorization', 'Bearer ' + accessToken);

            HttpResponse functionResponse = http.send(functionRequest);

            if (functionResponse.getStatusCode() == 200) {
                return functionResponse.getBody();
               
            } else {
                return 'Error accessing the function: ' + functionResponse.getStatus();
            }
        } else {
            return 'Error obtaining access token: ' + authResponse.getStatus();
        }
    }
          return 'String';
}
}*/
public class GCPIntegrationService {

    // Replace with your GCP API endpoint
    private static final String GCP_ENDPOINT = 'https://asia-south1-winged-math-399709.cloudfunctions.net/function-1';

    // Replace with your GCP access token
    private static final String ACCESS_TOKEN = 'ya29.a0AfB_byBRkQrIJ4XHQS-l7n1w-YduALuteR1QDEK8RurGKg-70sdqxgN87HDTBwjzZCUGs9GGQYoyYyUn9x8P_4GIaRfpaeCEu88WJWp8NTkKknV4wduXHSK8WEZNY5_h7Wu9Mcw8lXtl44IN2UiyvmzD06BDIr2IwkqCaCgYKAVASARISFQGOcNnCIHTo94nCVCCUiCQZk22_Jg0171';

    public static String callGCPService() {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        HttpResponse response;

        // Set the HTTP request method to GET
        request.setMethod('GET');

        // Set the GCP API endpoint URL
        request.setEndpoint(GCP_ENDPOINT);

        // Set the Authorization header with the access token
        request.setHeader('Authorization', 'Bearer ' + ACCESS_TOKEN);

        try {
            // Send the HTTP request
            response = http.send(request);

            // Check the HTTP response status
            if (response.getStatusCode() == 200) {
                // Successful response, return the response body
                return response.getBody();
            } else {
                // Handle errors or return an error message
                return 'Error: ' + response.getStatusCode() + ' ' + response.getStatus();
            }
        } catch (Exception e) {
            // Handle exceptions
            return 'Exception: ' + e.getMessage();
        }
    }
}