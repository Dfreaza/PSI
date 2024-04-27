import { Component } from '@angular/core';
import { WebsiteService } from '../website.service';
import { Location } from '@angular/common';
import { IWebsite } from '../website';
import { IPage } from '../page';



@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.css']
})
export class AddPageComponent {

  pageUrl: string = '';
  pageUrls: string = '';
  currentWebsite: IWebsite | null;
  pageInvalid: boolean = false;

  ngOnInit() {
    this.currentWebsite = this.websiteService.getCurrentWebsite();
    console.log("AddPageComponent ngOnInit " + this.currentWebsite?.url);
  }

  constructor(private location: Location, public websiteService: WebsiteService) { 
    this.currentWebsite = this.websiteService.getCurrentWebsite();
  }

// Em AddPageComponent
addPage(pageUrl: string) {
  if(this.currentWebsite && !pageUrl.startsWith(this.currentWebsite.url)){
    this.pageInvalid = true;
    console.log("O URL da página não pertence ao site.");
    return;
  }
  const page = { url: pageUrl } as IPage;
  this.websiteService.addPageToWebsite(page).subscribe(updatedWebsite => {
    console.log('Website updated', updatedWebsite);
    this.pageInvalid = false;
  });
}

  goBack(): void {
    this.location.back();
  }

/* 
  addPages() {
    try {
      const pages = this.pageUrls.split(',').map(url => url.trim());
      this.websiteService.addPagesToWebsite(this.currentWebsite, pages).subscribe(() => {
        this.pageUrls = '';
      });
    } catch {
      console.log("error")
    }
  } */
}
