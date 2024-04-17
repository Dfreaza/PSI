import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {
  constructor(private http: HttpClient) { }

  addWebsite(url: string) {
    return this.http.post('http://localhost:3000/api/websites', { url });
  }
}