import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebsiteService } from '../website.service';
import { IWebsite } from '../website';
import { IPage } from '../page';

@Component({
  selector: 'app-detail-statistics',
  templateUrl: './detail-statistics.component.html',
  styleUrls: ['./detail-statistics.component.css']
})
export class DetailStatisticsComponent {
  filterTests(s: string) {
    if(s === 'cwagFiltered'){
      this.cwagFiltered = !this.cwagFiltered;
    }
    else if (s === 'actFiltered'){
      this.actFiltered = !this.actFiltered;
    }
    console.log(this.actFiltered);
  }
  cwagFiltered: boolean = true;
  actFiltered: boolean = true;
  totalPassedTests: number = 0;
  totalWarningTests: number = 0;
  totalFailedTests: number = 0;
  totalInapplicableTest: number = 0;
  actRulesTestsResults: any[] = [];
  wcagTestsResults: any[] = [];

  website = {} as IWebsite;
  page = {} as IPage;

constructor(private route: ActivatedRoute, private websiteService: WebsiteService) {}

 ngOnInit(): void {
  const websiteId = this.route.snapshot.paramMap.get('websiteId')!;
  const pageId = this.route.snapshot.paramMap.get('pageId')!;

  this.websiteService.getWebsitePage(websiteId, pageId).subscribe((data: any |null) => {
    this.page = data;
    console.log(this.page);
  });
  
  this.websiteService.getDetailStatistics(websiteId, pageId).subscribe((data: any |null) => {
    if(data && data.length > 0){
      console.log(data[0]);
    }
    this.totalPassedTests = data[0].totalPassedTests;
    this.totalWarningTests = data[0].totalWarningTests;
    this.totalFailedTests = data[0].totalFailedTests;
    this.totalInapplicableTest = data[0].totalInapplicableTests;
    this.actRulesTestsResults = data[0].actRulesTestsResults;
    this.wcagTestsResults = data[0].wcagTestsResults;
  });
 }

}


