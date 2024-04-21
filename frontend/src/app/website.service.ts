import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {
  addPagesToWebsite(selectedWebsite: string, pages: string[]) {
    return this.http.post(`${this.getWebsite(selectedWebsite)}/addPages`, { url: selectedWebsite, pageUrls: pages });
  }
  
  constructor(private http: HttpClient) { }

  addWebsite(url: string) {
    return this.http.post('http://localhost:3000/api/websites', { url });
  }

  getWebsites() {
    return this.http.get('http://localhost:3000/api/websites');
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
  