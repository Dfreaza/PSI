import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { IWebsite } from './website';
import { IPage } from './page';

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {

  private currentWebsite = new BehaviorSubject<IWebsite | null>(null);
  currentWebsite$ = this.currentWebsite.asObservable();
  private currentWebsiteValue: IWebsite | null = null;

  constructor(private http: HttpClient) {
    this.currentWebsite$.subscribe(website => {
      this.currentWebsiteValue = website;
    });
  }

  changeCurrentWebsite(website: IWebsite) {
    this.currentWebsite.next(website);
  }

  getCurrentWebsite() {
    return this.currentWebsiteValue;
  }

  addPagesToWebsite(selectedWebsite: string, pages: string[]) {
    return this.http.post(`${this.getWebsite(selectedWebsite)}/addPages`, { url: selectedWebsite, pageUrls: pages });
  }

  addPageToWebsite(page: IPage): Observable<IWebsite> {
    return this.currentWebsite$.pipe(
      take(1),
      filter((website: IWebsite | null): website is IWebsite => website !== null),
      switchMap((website: IWebsite) => {
        website.pages.push(page);
        return this.http.put<IWebsite>(`http://localhost:3000/api/websites/${website._id}`, { page });
      })
    );
  }

  addWebsite(website: IWebsite): Observable<IWebsite>{
    return this.http.post<IWebsite>('http://localhost:3000/api/websites', website);
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
  