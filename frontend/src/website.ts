import { IPage } from './page';

export interface IWebsite {
    id: number;
    url: string;
    pages: IPage[]; 
}