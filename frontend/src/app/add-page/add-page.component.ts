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
  selectedWebsite: string = '';


  constructor(private location: Location, private websiteService: WebsiteService) { }

  addPage() {
    try {
      const page = this.pageUrl.trim();
      this.websiteService.addPageToWebsite(this.selectedWebsite, page).subscribe(() => {
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
      this.websiteService.addPagesToWebsite(this.selectedWebsite, pages).subscribe(() => {
        this.pageUrls = '';
      });
    } catch {
      console.log("error")
    }
  }
}
