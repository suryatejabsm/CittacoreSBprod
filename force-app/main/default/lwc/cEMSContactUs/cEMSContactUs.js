import { LightningElement,api,wire,track } from 'lwc';
import COMPANY_LOGO_URL from '@salesforce/resourceUrl/companyLogo';
export default class CEMSContactUs extends LightningElement {
    @api companyLogoUrl = COMPANY_LOGO_URL;
     @api companyEmail = 'example@example.com';
    @api linkedInUrl = 'https://www.linkedin.com/company/example';
    @api linkedInText = 'Follow us on LinkedIn';

}