import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {
  addPagesToWebsite(selectedWebsite: string, pages: string[]) {
    return this.http.post(`${this.getWebsite(selectedWebsite)}/addPages`, { url: selectedWebsite, pageUrls: pages });
  }
  addPageToWebsite(websiteId: string, pageUrl: string): Observable<any> {
    return this.http.post(`http://localhost:3000/api/websites/${websiteId}/pages`, { url: pageUrl });
  }
  constructor(private http: HttpClient) { }

  addWebsite(url: string) {
    return this.http.post('http://localhost:3000/api/websites', { url });
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
  