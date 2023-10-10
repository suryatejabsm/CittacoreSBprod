@isTest
private class getRecordDataControllerTest {
    @isTest
    static void testGetSlides() {
        // Create test records
        List<Slide__c> slides = new List<Slide__c>();
        for (Integer i = 0; i < 5; i++) {
            Slide__c slide = new Slide__c();
          //  slide.Name = 'Slide ' + i;
            slide.image__c = 'https://example.com/image' + i + '.png';
            slide.Heading__c = 'Slide Heading ' + i;
            slide.Description__c = 'Slide Description ' + i;
            slide.altText__c = 'Alt Text ' + i;
            slides.add(slide);
        }
        insert slides;
        System.debug('The record ' + slides);
        
        // Call the method being tested
        Test.startTest();
        List<Slide__c> result = getRecordDataController.getSlides();
        Test.stopTest();
        
        // Verify the results
        System.assertEquals(5, result.size());
        for (Integer i = 0; i < 5; i++) {
            //System.assertEquals('Slide ' + i, result[i].Name);
            System.assertEquals('https://example.com/image' + i + '.png', result[i].image__c);
            System.assertEquals('Slide Heading ' + i, result[i].Heading__c);
            System.assertEquals('Slide Description ' + i, result[i].Description__c);
            System.assertEquals('Alt Text ' + i, result[i].altText__c);
        }
    }
}