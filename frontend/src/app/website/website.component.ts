import { Component, OnInit } from '@angular/core';
import { WebsiteService } from '../website.service';

@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.css']
})
export class WebsiteComponent implements OnInit {
  url: string = '';
  pageUrls: string = '';
  selectedWebsite: string = '';
  websites: any[] = [];

  constructor(private websiteService: WebsiteService) { }

  ngOnInit() {
    this.websiteService.getWebsites().subscribe((websites: any[]) => {
      this.websites = websites;
    });
  }

  addWebsite() {
    try {
      const checkurl = new URL(this.url);
      this.websiteService.addWebsite(this.url).subscribe(() => {
        this.url = '';
      });
    } catch {
      console.log("error")
    }
  }

  addPages() {
    try {
      const pages = this.pageUrls.split(',').map(url => url.trim());
      this.websiteService.addPagesToWebsite(this.selectedWebsite, pages).subscribe(() => {
        this.pageUrls = '';
      });
    } catch {
      console.log("error")
    }
  }

  ackCorrectWebsiteURL() {
    return this.url !== '' && new URL(this.url).hostname !== 'localhost';
  }
}