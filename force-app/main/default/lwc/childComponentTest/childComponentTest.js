import { LightningElement, track } from 'lwc';
 
export default class ChildComponentTest extends LightningElement {  
 
    constructor(){
        super(); //Calling Constructor of LightningElement
        console.log('Constructor called =>');
    }
 
    connectedCallback() {}
 
    renderedCallback(){        
        console.log('Child Component renderedCallback from Parent Component =>');
    }
   
}