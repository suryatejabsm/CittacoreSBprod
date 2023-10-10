public without sharing class AccViewContlr {
    @AuraEnabled(cacheable = true)
    public static List<Employee_Training__c> getEmployeeTrainings() {
        List<Employee_Training__c> employeeTrainings = [
            SELECT Id, CEMS_Employee_Name__r.Name, CEMS_Learning_Name__r.CEMS_Learning_Name__c, CEMS_Certification_Name__r.CEMS_Certificate_Name__c,
                CEMS_Status__c, CEMS_Due_Date__c
            FROM Employee_Training__c
        ];

        if (employeeTrainings.isEmpty()) {
            throw new AuraHandledException('No Record Found..');
        }

        return employeeTrainings;
    }
    @AuraEnabled
    public static Employee_Training__c getEmployeeTrainingById(String trainingId) {
        return [
            SELECT Id, CEMS_Employee_Name__r.Name, CEMS_Learning_Name__r.CEMS_Learning_Name__c,
                   CEMS_Certification_Name__r.CEMS_Certificate_Name__c, CEMS_Status__c, CEMS_Due_Date__c
            FROM Employee_Training__c
            WHERE Id = :trainingId
            LIMIT 1
        ];
    }
 @AuraEnabled
public static String uploadFile2(String base64, String filename, String userEmail) {
    try {
        // Query the Appointee__c records that match the logged-in user's email
        List<CEMS_Personnel__c> appointeeList = [
            SELECT Id,CEMS_Work_Email__c
            FROM CEMS_Personnel__c
            WHERE CEMS_Work_Email__c = :userEmail
            LIMIT 1
        ];
        
        if (!appointeeList.isEmpty()) {
            CEMS_Personnel__c appointee = appointeeList[0];
            System.debug('appointee:'+appointee);

            ContentVersion cv1 = createContentVersion(base64, filename);
            ContentDocumentLink cdl1 = createContentLink(cv1.Id, appointee.Id);
            
            if (cv1 != null && cdl1 != null) {
                return cdl1.Id;
            } else {
                return null;
            }
        } else {
            System.debug('Invalid user');
            return 'Invalid user.';
        }
    } catch (Exception e) {
        System.debug(e);
        return null;
    }
}
    @AuraEnabled
public static String uploadFile1(String base64, String filename, String email) {
    try {
        // Query the Appointee__c records that match the logged-in user's email
        List<CEMS_Personnel__c> appointeeList = [
            SELECT Id,CEMS_Work_Email__c
            FROM CEMS_Personnel__c
            WHERE CEMS_Work_Email__c = :email
            LIMIT 1
        ];
        
        if (!appointeeList.isEmpty()) {
            CEMS_Personnel__c appointee = appointeeList[0];
            System.debug('appointee:'+appointee);

            ContentVersion cv1 = createContentVersion(base64, filename);
            ContentDocumentLink cdl1 = createContentLink(cv1.Id, appointee.Id);
            
            if (cv1 != null && cdl1 != null) {
                return cdl1.Id;
            } else {
                return null;
            }
        } else {
            System.debug('Invalid user');
            return 'Invalid user.';
        }
    } catch (Exception e) {
        System.debug(e);
        return null;
    }
}

private static ContentVersion createContentVersion(String base64, String filename) {
    ContentVersion cv1 = new ContentVersion();
    cv1.VersionData = EncodingUtil.base64Decode(base64);
    cv1.Title = filename;
    cv1.PathOnClient = filename;
    
    try {
        insert cv1;
        return cv1;
    } catch (DMLException e) {
        System.debug(e);
        return null;
    }
}

private static ContentDocumentLink createContentLink(String contentVersionId, Id appointeeId) {
    if (contentVersionId == null || appointeeId == null) {
        return null;
    }
    
    ContentDocumentLink cdl1 = new ContentDocumentLink();
    cdl1.ContentDocumentId = [
        SELECT ContentDocumentId 
        FROM ContentVersion 
        WHERE Id = :contentVersionId
    ].ContentDocumentId;
    
    cdl1.LinkedEntityId = appointeeId;
    cdl1.ShareType = 'I';
    
    try {
        insert cdl1;
        return cdl1;
    } catch (DMLException e) {
        System.debug(e);
        return null;
    }
}

@AuraEnabled(cacheable=true)
public static List<ContentVersion> fetchFiles(String email) {
    CEMS_Personnel__c personnel = [SELECT Id,CEMS_Work_Email__c FROM CEMS_Personnel__c WHERE CEMS_Work_Email__c = :email];
    
    if (personnel != null) {
        Id userId = personnel.Id;
                 List<ContentDocumentLink> version1 = [SELECT Id, LinkedEntityId, ContentDocumentId FROM ContentDocumentLink where LinkedEntityId =:userId];
        set<string> newset = new set<string>();
        for(ContentDocumentLink Documentid:version1){
            newset.add(Documentid.ContentDocumentId);
        }
        
        List<ContentVersion> version =  [SELECT Id, ContentDocumentId, ContentUrl,IsLatest, Title, Description, FileType, FileExtension, VersionDataUrl
                FROM ContentVersion 
                WHERE ContentDocumentId = :newset];
                     return version;
    } else {
        return new List<ContentVersion>(); // Return an empty list if no matching record is found
    }
}
    

    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> fetchFiles2(String email) {
        CEMS_Personnel__c personnel = [SELECT Id, CEMS_Work_Email__c FROM CEMS_Personnel__c WHERE CEMS_Work_Email__c = :email];
        system.debug('personnel'+personnel);
        if (personnel != null) {
            Id userId = personnel.Id;
            List<ContentDocumentLink> documentLinks = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :userId];
                    system.debug('documentLinks'+documentLinks);

            Set<Id> documentIds = new Set<Id>();
            for (ContentDocumentLink link : documentLinks) {
                documentIds.add(link.ContentDocumentId);
            }
            
            List<ContentVersion> versions = [SELECT Id, ContentDocumentId, Title, Description, FileType, FileExtension,VersionDataUrl
                                             FROM ContentVersion
                                             WHERE ContentDocumentId IN :documentIds];
                                system.debug('versions'+versions);

            List<Map<String, Object>> fileList = new List<Map<String, Object>>();
            for (ContentVersion version : versions) {
                Map<String, Object> fileMap = new Map<String, Object>();
                fileMap.put('Id', version.Id);
                fileMap.put('Title', version.Title);
                fileMap.put('Description', version.Description);
                fileMap.put('FileType', version.FileType);
                fileMap.put('FileExtension', version.FileExtension);
                
                // Generate the file preview URL based on the FileType and FileExtension
                String filePreviewUrl;
                if (version.FileType == 'PDF') {
                    // Replace 'yourCommunityDomain' with your actual Salesforce Community domain
                    filePreviewUrl = 'https://cittacoretechnologiesinc3--ems.sandbox.lightning.force.com/lightning/page/home' + version.Id;
                } else if (version.FileType == 'Image') {
                    // Replace 'yourCommunityDomain' with your actual Salesforce Community domain
                    filePreviewUrl = 'https://yourCommunityDomain.force.com/services/apexrest/FilePreviewController/getFileContent/' + version.Id;
                } else {
                    // For other file types, handle accordingly or set the URL as null
                    filePreviewUrl = null;
                }
                
                fileMap.put('FilePreviewUrl', filePreviewUrl);
                
                fileList.add(fileMap);
            }
                                system.debug('fileList'+fileList);
            
            return fileList;
        } else {
            return new List<Map<String, Object>>(); // Return an empty list if no matching record is found
        }

    }   
    @AuraEnabled(cacheable = true)
    public static List<String> getExperienceOptions() {
        List<Schema.PicklistEntry> pickListVal = CEMS_Job_Opening__c.CEMS_Experience__c.getDescribe().getPickListValues();
        List<String> experienceOptions = new List<String>();
        for (Schema.PickListEntry pickListValue : pickListVal) {
            experienceOptions.add(pickListValue.getValue());
        }
        return experienceOptions;
    
}
@AuraEnabled
    public static Id createJobApplication(Map<String, Object> fields) {
        try {
            CEMS_Job_Application__c jobApplication = new CEMS_Job_Application__c();
            jobApplication.put('RecordTypeId', (Id) fields.get('RecordTypeId'));
            //jobApplication.put('Field1__c', fields.get('Field1__c'));
            //jobApplication.put('Field2__c', fields.get('Field2__c'));
            // Add more fields as needed

            insert jobApplication;
            return jobApplication.Id;
        } catch (Exception ex) {
            throw new AuraHandledException('Error creating record: ' + ex.getMessage());
        }
    }
    
     }