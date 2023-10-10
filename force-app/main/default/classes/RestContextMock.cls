// Mock classes for RestContext.request and RestContext.response
@isTest
public class RestContextMock implements HttpCalloutMock {
    public HTTPResponse respond(HTTPRequest req) {
        HttpResponse res = new HttpResponse();
        res.setStatusCode(200);
        res.setStatus('OK');
        res.setBody('{"totalCount": 10, "currentPage": 1, "displaylimit": 5, "jobOpenings": []}');
        return res;
    }
}