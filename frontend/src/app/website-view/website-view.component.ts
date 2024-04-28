import { Component, OnInit } from '@angular/core';
import { WebsiteService } from '../website.service';
import { Router } from '@angular/router';
import { IWebsite } from '../website';
import { WebsiteComponent } from '../website/website.component';

@Component({
  selector: 'app-website-view',
  templateUrl: './website-view.component.html',
  styleUrls: ['./website-view.component.css']
})
export class WebsiteViewComponent implements OnInit{
  
  constructor(private router: Router, private websiteService: WebsiteService, private websiteComponent: WebsiteComponent) { }

  websites: IWebsite[] = [];
  submissionOrder: boolean = true;
  appraisalOrder: boolean = true;
  filter: string = 'Nenhum';
  invalidWebsite: boolean = false;
  
  ngOnInit() {
    this.websiteService.getWebsites().subscribe((webs: IWebsite[]) => {
      this.websites = webs;
    });
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

  filterStatus(filter: any){
    let sites = this.websites;
    
    if(filter === "Por avaliar"){
      sites = sites.filter( (a) => a.status === filter);
    }
    else if(filter === "Em avaliação"){
      sites = sites.filter( (a) => a.status === filter);
    }
    else if(filter === "Avaliado"){
      sites = sites.filter( (a) => a.status === filter);
    }
    else if(filter === "Erro na avaliação"){
      sites = sites.filter( (a) => a.status === filter);
    }
    return sites;
  }  

  activateFilter(s: any){
    this.filter = s.target.value;
  }
  
  goToPage(site: IWebsite){
    this.websiteService.changeCurrentWebsite(site);
    this.router.navigate(['/add-page']);
  }

  goToDetails(website: IWebsite) {
    this.router.navigate(['/website-details', website._id]);
  }

  showTime(time: Date){
    return new Date(time).toUTCString();
  }
}
