import { Component, OnInit } from '@angular/core';
import { WebsiteService } from '../website.service';
import { WebsiteComponent } from '../website/website.component';
import { Router } from '@angular/router'
import { WebsiteViewComponent } from '../website-view/website-view.component';
import { IWebsite } from '../website';
import { IPage } from '../page';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-website-details',
  templateUrl: './website-details.component.html',
  styleUrls: ['./website-details.component.css']
})
export class WebsiteDetailsComponent implements OnInit{

  constructor(private route: ActivatedRoute, private router: Router, private websiteService: WebsiteService, private websiteComponent: WebsiteComponent) { }

  website = {} as IWebsite;
  pages: IPage[] = [];
  page = {} as IPage;
  evaluation = "NA" as string;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.websiteService.getWebsite(id).subscribe((website: any | null) => {
      if (website) {
        this.website = website;
        this.pages = website.pages;
      }
    });
  }

  choosePage(id: number){
    this.page = this.pages.find(p => p.id === id) as IPage;
  }

  showPath(url: string) {
    try {
      new URL(url); // This will throw an error if url is not a valid URL
      return url;
    } catch (_) {
      return "Invalid URL: " + url;
    }
  }

  showPages(){
    return this.pages;
  }

  getEvaluation(){
    return this.evaluation;
  }

  evaluateSelectedPages() {
    const selectedPages = this.website.pages.filter(page => page.selected);
    this.websiteService.evaluatePages(this.website, selectedPages).subscribe((evaluationResults: String[] | null) => {
        if (evaluationResults) {
          for (let i = 0; i < selectedPages.length; i++) {
            selectedPages[i].conformity = evaluationResults[i];
          }
        }
      });
  }

  showTime(time: Date){
    return new Date(time).toUTCString();
  }
}

