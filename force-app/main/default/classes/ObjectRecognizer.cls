public class ObjectRecognizer {
    public class BaseException extends Exception {
   
}

   
 public static string getAccessToken()
     {
        GoogleAuthSetting__mdt mapping = 
            [SELECT AccessToken__c, Label FROM GoogleAuthSetting__mdt WHERE Label='Fitness' and DeveloperName='Fitness'];
        return mapping.AccessToken__c;
    }
    //   try {
    //     GoogleAuthSetting__mdt mapping = [SELECT AccessToken__c, Label FROM GoogleAuthSetting__mdt WHERE Label='Fitness' and DeveloperName='Fitness'];
    //     return mapping.AccessToken__c;
    // } catch (Exception e) {
    //     System.debug('Error retrieving access token: ' + e.getMessage());
    //     return null; // Return null if there's an exception while fetching the token
    // }
    //  }
    @auraenabled(cacheable=true)
    public static List<Case> getObjectCases()
    { 
        system.debug('Case:' + [select id from case where RecordType.Name='Logo Recognition']);
        return [select id from case where RecordType.Name='Logo Recognition'];
    }
    
    @auraenabled(cacheable=false)
    public static ImageResponse getImage(string id)
    {
        if(string.isEmpty(id))
        {
            throw new BaseException('Bad Input');
        }
        List<ContentDocumentLink> links=[SELECT ContentDocumentId,LinkedEntityId FROM ContentDocumentLink where LinkedEntityId=:id];
        system.debug('links++'+links);
        Set<Id> ids=new Set<Id>();	
        for(ContentDocumentLink link:links)
        {
            ids.add(link.ContentDocumentId);
        }
                system.debug('ids++'+ids);

        List<ContentVersion> versions=[SELECT VersionData,Title,ContentDocumentId,FileExtension FROM ContentVersion WHERE ContentDocumentId = :ids AND IsLatest = true];
                        system.debug('versions++'+versions);

        List<ContentDistribution> cdts=[select ContentDocumentId,DistributionPublicUrl,ContentDownloadURL from ContentDistribution where ContentDocumentId =:ids];
                                system.debug('cdts++'+cdts);

        Map<String, ContentDistribution> contentList= new Map <String, ContentDistribution>();  
        for(ContentDistribution cdt:cdts)
        {
            contentList.put(cdt.ContentDocumentId, cdt);     
        }
                                        system.debug('contentList++'+contentList);

        
        for(ContentVersion attach:versions)
        {           
            ContentDistribution image=contentList.get(attach.ContentDocumentId);
            if(image!=null)
            {           
                
                ImageResponse response=new ImageResponse();
                response.PublicUrl=image.DistributionPublicUrl;
                response.DownloadableUrl=image.ContentDownloadUrl;
                return response;
            }
             system.debug('attach++'+ attach);

        }

        return null;        
    }
    
    @auraenabled(cacheable=true)
    public static List<ObjectInformation> getObjectInformation(string record)
    {
        if(string.isEmpty(record))
        {
            throw new BaseException('Bad Input');
        }
        
        List<ContentDocumentLink> links=[SELECT ContentDocumentId,LinkedEntityId FROM ContentDocumentLink where LinkedEntityId=:record];
                                                        system.debug('links++'+links);

        Set<Id> ids=new Set<Id>();
        for(ContentDocumentLink link:links)
        {
            ids.add(link.ContentDocumentId);
        }
          system.debug('ids++'+ids);

        List<ContentVersion> versions=[SELECT VersionData,Title,ContentDocumentId,FileExtension FROM ContentVersion WHERE ContentDocumentId = :ids AND IsLatest = true];
                  system.debug('versions++'+versions);

        for(ContentVersion attach:versions)
        {           
            if(attach!=null)
            {   
                List<ObjectInformation> objects=getImageObject(attach.VersionData);
                system.debug('objects:'+ objects);
                return objects;
            }
        }

        return null;
    }
    
    @AuraEnabled
    public static List<ObjectInformation> getImageObject(Blob data)
    {   
        string strToken=getAccessToken();
        if(string.isEmpty(strToken))
        {
            return null;
        }
        system.debug(strToken);
        HttpRequest req = new HttpRequest();
        req.setHeader('Authorization','Bearer '+ strToken);
        system.debug('strToken++'+strToken);
        req.setHeader('Content-Type','application/json; charset=utf-8');
        req.setMethod('POST');
        req.setEndpoint('https://vision.googleapis.com/v1/images:annotate');
        req.setTimeout(120000);
                          system.debug('req++'+req);

        
        ObjectRecogRequest.request request=new ObjectRecogRequest.request();
                                 
        ObjectRecogRequest.feature feature=new ObjectRecogRequest.feature();
        feature.type='OBJECT_LOCALIZATION';
        feature.maxResults=10;
        
        ObjectRecogRequest.image img=new ObjectRecogRequest.image();
        img.content =data;        
        
        request.image =img;
        
        request.features =new List<ObjectRecogRequest.feature>();
        request.features.add(feature);
         system.debug('request++'+request);
      system.debug('feature++'+feature);

        
        List<ObjectRecogRequest.request> requests=new List<ObjectRecogRequest.request>();
        requests.add(request);
              system.debug('requests++'+requests);

        
        ObjectRecogRequest objReq=new ObjectRecogRequest();
        objReq.requests=requests;
                      system.debug('objReq++'+objReq);

        req.setBody(JSON.serialize(objReq));
        Http http = new Http();
        HTTPResponse res = http.send(req);
        system.debug('Authorization response.....'+res);
        if(res.getStatus() =='Unauthorized')
        {
            system.debug('Unauthorized.....');
            return null;
        }
        else
        {         
            ObjectRecogResponse objects=ObjectRecogResponse.parse(res.getBody());
            ObjectInformation info;
            List<ObjectInformation> infos=new List<ObjectInformation>();
            for(ObjectRecogResponse.Response obj:objects.responses)
            {
                if(obj!=null && !obj.localizedObjectAnnotations.isEmpty())
                {
                    for(ObjectRecogResponse.LocalizedObjectAnnotation annot:obj.localizedObjectAnnotations)
                    {
                        info=new ObjectInformation();
                        info.ObjectName=annot.name;
                        info.Score=annot.score;
                        infos.add(info);
                    }
                }
            }
            return infos;
        }
    } 
    public class ImageResponse
    {
        @auraenabled
        public string PublicUrl;
        @auraenabled
        public string DownloadableUrl;
    }  
    
    public class ObjectInformation
    {
        @auraenabled
        public string ObjectName;
        @auraenabled
        public decimal Score;
    }
}