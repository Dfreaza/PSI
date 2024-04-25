import { IPage } from './page';

export interface IWebsite {
    url: string;
    pages: IPage[]; 
    status: string;
    submissionDate: Date;
    appraisalDate: Date;
}