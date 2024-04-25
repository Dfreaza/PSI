import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { IWebsite } from './website';

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {

  private currentWebsite = new BehaviorSubject<string>('');
  currentWebsite$ = this.currentWebsite.asObservable();

  changeCurrentWebsite(website: string) {
    this.currentWebsite.next(website);
  }

  getCurrentWebsite() {
    return this.currentWebsite.asObservable();
  }

  constructor(private http: HttpClient) { }

  addPagesToWebsite(selectedWebsite: string, pages: string[]) {
    return this.http.post(`${this.getWebsite(selectedWebsite)}/addPages`, { url: selectedWebsite, pageUrls: pages });
  }
  addPageToWebsite(websiteId: string, pageUrl: string): Observable<any> {
    return this.http.post(`http://localhost:3000/api/websites/${websiteId}/pages`, { url: pageUrl });
  }

  addWebsite(website: IWebsite) {
    return this.http.post('http://localhost:3000/api/websites', website);
  }

  getWebsites(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/api/websites');
  }

  getWebsite(id: string) {
    return this.http.get(`http://localhost:3000/api/websites/${id}`);
  }

  getPages(id: string) {
    return this.http.get(`http://localhost:3000/api/websites/${id}/pages`);
  }

  getWebsitePages(id: string) {
    return this.http.get(`http://localhost:3000/api/websites/${id}/pages`);
  }

  getWebsitePage(id: string, pageId: string) {
    return this.http.get(`http://localhost:3000/api/websites/${id}/pages/${pageId}`);
  }
}
  