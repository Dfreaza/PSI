import { Component, OnInit } from '@angular/core';
import { WebsiteService } from '../website.service';
import { WebsiteComponent } from '../website/website.component';
import { Router } from '@angular/router'
import { WebsiteViewComponent } from '../website-view/website-view.component';
import { IWebsite } from '../website';
import { IPage } from '../page';

@Component({
  selector: 'app-website-details',
  templateUrl: './website-details.component.html',
  styleUrls: ['./website-details.component.css']
})
export class WebsiteDetailsComponent implements OnInit{

  constructor(private route: Router, private websiteService: WebsiteService, private websiteComponent: WebsiteComponent) { }

  website = {} as IWebsite;
  pages: IPage[] = []; 

  ngOnInit() {
    this.websiteService.getCurrentWebsite().subscribe((webs: IWebsite | null) => {
      if (webs) {
        this.website = webs;
        this.pages = webs ? webs.pages : [];
      }
    });
  }
}
