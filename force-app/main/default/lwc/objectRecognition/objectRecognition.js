import { LightningElement,wire,track,api } from 'lwc';
import getImage from '@salesforce/apex/ObjectRecognizer.getImage';
import getObjectInformation from '@salesforce/apex/ObjectRecognizer.getObjectInformation';
import getObjectCases from '@salesforce/apex/ObjectRecognizer.getObjectCases';

const columns = [
    { label: 'Object Name', fieldName: 'ObjectName' },
    { label: 'Accuracy Score', fieldName: 'Score'}
];

export default class ObjectRecognition extends LightningElement {
    @api isLoaded = false;
    @api recordId;
    imageUrl;
    downloadUrl;
    data = [];;
    error;  
    selectOptions=[];
    columns=columns;
    @track selectedCase;

    @wire(getObjectCases)
    lists({ error, data }) {
        if (data) {
            console.log("DATATAAA"+JSON.stringify(data));
            for(const list of data){
                const option = {
                    label: list.Id,
                    value: list.Id
                };
                this.selectOptions = [ ...this.selectOptions, option ];
                console.log(this.selectOptions);
            }
        } else if (error) {
            console.error(error);
        }
        this.isLoaded=true;
    }
    handleCaseChange(e)
    {
        this.isLoaded=false;
        this.recordId=e.detail.value;
        console.log( this.recordId);
        getImage({id: e.detail.value})
        .then((data,error) => {
            if (data) {
                console.log("imageURL:"+data);
                this.imageUrl=data.PublicUrl;
                this.downloadUrl=data.DownloadableUrl;
                this.error = undefined;
                this.isLoaded=true;
            } else if (error) {
                this.error = error;
                console.log('Error:'+ JSON.stringify(error));
                this.isLoaded=true;
            }
        });
    }
    getObjectDetail(event)
    {
        this.isLoaded=false;
        getObjectInformation({ record: this.recordId})
        .then((data,error) => {
             console.log("Data:"+JSON.stringify(data));
           if (data) {
                this.data=data;
            } else {
                this.error = error;
            }
            this.isLoaded=true;
        })
        .catch(error => {
            this.error = error;
            this.isLoaded=true;
        });
    }
}