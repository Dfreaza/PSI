import { Component } from '@angular/core';
import { WebsiteService } from '../website.service';
import { Location } from '@angular/common';



@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.css']
})
export class AddPageComponent {

  pageUrl: string = '';
  pageUrls: string = '';
  currentWebsite: string;


  constructor(private location: Location, public websiteService: WebsiteService) { 
    this.currentWebsite = '';
    this.websiteService.getCurrentWebsite().subscribe(website => this.currentWebsite = website);  }

  addPage() {
    if (this.currentWebsite) {
      console.log('currentWebsite está armazenando um valor:', this.currentWebsite);
    } else {
      console.log('currentWebsite não está armazenando um valor');
    }
    try {
      const page = this.pageUrl.trim();
      this.websiteService.addPageToWebsite(this.currentWebsite, page).subscribe(() => {
        this.pageUrl = '';
      });
    } catch {
      console.log("error")
    }
  }

  goBack(): void {
    this.location.back();
  }


  addPages() {
    try {
      const pages = this.pageUrls.split(',').map(url => url.trim());
      this.websiteService.addPagesToWebsite(this.currentWebsite, pages).subscribe(() => {
        this.pageUrls = '';
      });
    } catch {
      console.log("error")
    }
  }
}
