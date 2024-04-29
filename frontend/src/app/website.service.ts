import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { IWebsite } from './website';
import { IPage } from './page';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WebsiteService {

  private apiUrl = 'http://localhost:3000';
  //private apiUrl = 'http://appserver.alunos.di.fc.ul.pt:3071';

  private currentWebsite = new BehaviorSubject<IWebsite | null>(null);
  currentWebsite$ = this.currentWebsite.asObservable();
  private currentWebsiteValue: IWebsite | null = null;

  constructor(private http: HttpClient) {
    this.currentWebsite$.subscribe(website => {
      this.currentWebsiteValue = website;
    });
  }

  evaluatePages(website: IWebsite, pages: IPage[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/evaluate`, { website, pages });
  }

  changeCurrentWebsite(website: IWebsite) {
    this.currentWebsite.next(website);
  }

  getCurrentWebsite(): Observable<IWebsite | null> {
    return of(this.currentWebsiteValue);
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
        return this.http.put<IWebsite>(`${this.apiUrl}/api/websites/${website._id}`, { page });
      })
    );
  }

  addWebsite(website: IWebsite): Observable<IWebsite>{
    return this.http.post<IWebsite>(`${this.apiUrl}/api/websites`, website);
  }

  getWebsites(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/websites`);
  }

  getWebsite(id: string) {
    return this.http.get(`${this.apiUrl}/api/websites/${id}`);
  }

  getPages(id: string) {
    return this.http.get(`${this.apiUrl}/api/websites/${id}/pages`);
  }

  getWebsitePages(id: string) {
    return this.http.get(`${this.apiUrl}/api/websites/${id}/pages`);
  }

  getWebsitePage(id: string, pageId: string) {
    return this.http.get(`${this.apiUrl}/api/websites/${id}/pages/${pageId}`);
  }
}
  