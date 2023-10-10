@RestResource(urlMapping='/LeadService/*')

global class LeadRestService {

    @httpget

    global static list<lead> getleadInformation(){

        RestRequest req = RestContext.request;

        RestResponse res = RestContext.response;

        system.debug('req.requestURI'+req.requestURI);

        string requestURI = req.requestURI;       

        string leadName ='%'+requestURI.substring(requestURI.lastIndexOf('=')+1)+'%';

        system.debug('leadName'+leadName);

        list<lead> leadlist = [SELECT Id,Name,Email,Phone,Company,MobilePhone from lead where Name like :leadName];

        return leadlist;

    }

}