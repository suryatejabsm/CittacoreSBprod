import { LightningElement,wire,api,track } from 'lwc';
//const DEFAULT_SLIDER_TIMER=2000;

import getSlides from '@salesforce/apex/getRecordDataController.getSlides';
export default class FlowCarousel extends LightningElement {
    
   // Expose the asset file URL for use in the template
    @api slideDuration;

    @api imageURLs = [];
    @api headers = [];
    @api descriptions = [];
    @api hyperlinkURLs = [];
    @api altText = [];
    @api carouselTitle;
    @api slideSize;
    @track isloggedin;

@wire(getSlides) wiredSlides;
/*slides= [
    {   
       // image:`${CAROUSEL_IMAGES}/carousel/photo1.jpg`,
        image:'https://cdn.britannica.com/54/150754-050-5B93A950/statue-Christ-the-Redeemer-Rio-de-Janeiro.jpg',
        heading:'Caption one',
        description:'You can add description of first slide here'
    },
    {    
        image:`${CAROUSEL_IMAGES}/carousel/photo2.jpg`,
        heading:'Caption Two',
        description:'You can add description of second slide here'
    },
    {  
        image:`${CAROUSEL_IMAGES}/carousel/photo3.jpg`,
        heading:'Caption Three',
        description:'You can add description of third slide here'
    }
]*/

}