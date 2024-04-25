import { Component, OnInit } from '@angular/core';
import { WebsiteService } from '../website.service';
import { Router } from '@angular/router';
import { IWebsite } from '../website';

@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.css']
})
export class WebsiteComponent implements OnInit {
  url: string = '';
  websites: IWebsite[] = [];

  constructor(private router: Router, private websiteService: WebsiteService) { }

  ngOnInit() {
    this.websiteService.getWebsites().subscribe((websites: IWebsite[]) => {
      this.websites = websites;
    });
  }

  addWebsite(url: string) {
    const newWebsite = { url: this.url, pages: [], status: '', submissionDate: new Date(), appraisalDate: new Date() };
    try {
      const checkurl = new URL(this.url);
      this.websiteService.addWebsite(newWebsite).subscribe((website: any) => {
        this.websites.push(website);
        this.websiteService.changeCurrentWebsite(this.url);
        this.router.navigate(['/add-page']);
        this.url = '';
      });
    } catch {
      console.log("error")
    }
  }

  ackCorrectWebsiteURL() {
    return this.url !== '' && new URL(this.url).hostname !== 'localhost';
  }
}