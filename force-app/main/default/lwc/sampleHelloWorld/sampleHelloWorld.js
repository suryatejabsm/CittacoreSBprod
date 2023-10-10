import { LightningElement, track } from 'lwc'
import templatePrimary from './sampleFirstTemplate.html';
import templateSecondary from './sampleSecondTemplate.html';
 
export default class SampleHelloWorld extends LightningElement{
 
    showTemplatePrimary = true;
 
    @track _isRendered = true;//boolean to check if component is rendered
 
    error;
    stack;
 
    constructor()
    {
        super();//Calling Constructor of LightningElement
        console.log('Constructor called =>');
    }
   
    connectedCallback()
    {
        let varElement = this.template;
        console.log('ConnectedCallback called =>'+varElement.isConnected);
    }
 
    render()
    {
        console.log('Render called =>'+this.showTemplatePrimary);
        return this.showTemplatePrimary ? templatePrimary : templateSecondary;
    }
 
    renderedCallback()
    {
        if(this._isRendered)
        {
            console.log('Parent Component renderedCallback =>');
            this._isRendered = false;
        }
    }
 
    disconnectedCallback()
    {
        console.log('Disconnected Callback =>');
    }
 
    errorCallback(error, stack){
        console.log('Error callBack called =>');
        this.error = error;
        this.stack = stack;
    }
}