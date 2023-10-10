import { LightningElement,track } from 'lwc';
import getAccessToken from '@salesforce/apex/GoogleAuthService.getAccessToken';
import createAuthURL from '@salesforce/apex/GoogleAuthService.createAuthURL';
export default class GoogleAuth extends LightningElement {
@track access;
    @track accessToken;

    connectedCallback() {
        // Perform any initialization here
        this.doInit();
    }

    doInit() {
        let url = window.location.href;
        console.log('url ' + url);

        function getParameterByName(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, '\\$&');
            let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                results = regex.exec(url);
            console.log('===results==', results);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        }

        let code = getParameterByName('code');

        if (code !== undefined && code !== '' && code !== null) {
            getAccessToken({ code: code })
                .then(result => {
                    this.accessToken = result;
                    this.access = result ? 'Authenticated..' : 'Not Authenticated..';
                })
                .catch(error => {
                    console.error('Error while fetching access token: ', error);
                });
        }
    }

    doAuth() {
        createAuthURL()
            .then(result => {
                let authUrl = result;
                console.log('authUrl ' + authUrl);
                window.location.href = result;
            })
            .catch(error => {
                console.error('Error while fetching authorization URL: ', error);
            });
    }
}