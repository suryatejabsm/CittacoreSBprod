import { LightningElement } from 'lwc';
import generateOtpHandler from '@salesforce/apex/CEMS_LoginHandler.generateOtpHandler';
import validateOtpHandler from '@salesforce/apex/CEMS_LoginHandler.validateOtpHandler';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
export default class CemsLogin extends LightningElement 
{
    isOtpGenerated= false;
    username;
    emailid;
    isLogin = true;
    otp;
    accessTokenEndpoint;
        

    handleOtp() 
    {
        this.username = this.template.querySelector('[data-id="username"]').value;
        console.log(this.username);
        this.emailid = this.template.querySelector('[data-id="emailid"]').value;
        console.log(this.emailid);
        
    
        generateOtpHandler({ employeeId: this.username, emailId: this.emailid })
            .then(result => {
                this.isOtpGenerated = true;
               this.isLogin = false;
                console.log(this.isOtpGenerated);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Please Enter OTP',
                        variant: 'success',
                    }),
                );
                // Code to handle the successful response from the server
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
                // Code to handle any errors that occurred during the server request
            });
    }

    handleLogin()
    {
        
        this.otp = this.template.querySelector('[data-id="otp"]').value;
        console.log(this.otp);
        validateOtpHandler({employeeId: this.username, emailId: this.emailid, otp:this.otp})
        .then(result=>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Authentication Success',
                    variant: 'success',
                }),
            );

        })
        .catch(error=>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'OTP Mismatch. Authentication Failed',
                    variant: 'error',
                }),
            );

        })
    }


   
          
      
    
}