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
  submissionOrder: boolean = true;
  appraisalOrder: boolean = true;

  constructor(private router: Router, private websiteService: WebsiteService) { }

  ngOnInit() {
    this.websiteService.getWebsites().subscribe((websites: IWebsite[]) => {
      this.websites = websites;
    });
  }

  addWebsite(url: string) {
    url = url.trim();
    if (!url) { return; }
    const website = { url: url } as IWebsite;
    this.websiteService.addWebsite(website)
      .subscribe((websiteFromServer: IWebsite) => {
      this.websites.push(websiteFromServer);
      this.websiteService.changeCurrentWebsite(websiteFromServer);
      this.router.navigate(['/add-page']);
    this.url = '';
  });
  }

  ackCorrectWebsiteURL() {
    return this.url !== '' && new URL(this.url).hostname !== 'localhost';
  }

  sortSub(ascendingOrder: boolean){

    if(ascendingOrder){
      this.websites.sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
    }
    else{
      this.websites.sort((a, b) => new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime());
    }
    this.submissionOrder = !this.submissionOrder;
  }

  sortAppr(ascendingOrder: boolean){
    if(ascendingOrder){
      this.websites.sort((a, b) => new Date(b.appraisalDate).getTime() - new Date(a.appraisalDate).getTime());
    }
    else{
      this.websites.sort((a, b) => new Date(a.appraisalDate).getTime() - new Date(b.appraisalDate).getTime());
    }
    this.appraisalOrder = !this.appraisalOrder;
  }  
}