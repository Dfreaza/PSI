import { Component, OnInit } from '@angular/core';
import { WebsiteService } from '../website.service';
import { WebsiteComponent } from '../website/website.component';
import { Router } from '@angular/router'
import { WebsiteViewComponent } from '../website-view/website-view.component';
import { IWebsite } from '../website';
import { IPage } from '../page';
import { Statistic } from '../statistic';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-website-details',
  templateUrl: './website-details.component.html',
  styleUrls: ['./website-details.component.css']
})
export class WebsiteDetailsComponent implements OnInit{

  pagesWithoutErrors: number = 0;

  constructor(private route: ActivatedRoute, private router: Router, private websiteService: WebsiteService, private websiteComponent: WebsiteComponent) { }

  website = {} as IWebsite;
  status  = {} as String;
  pages: IPage[] = [];
  page = {} as IPage;
  cboxCheck: boolean = false;
  website_id = 0;
  conformity = "NA";
  statistics = {} as Statistic[];

  //Statistics valores
  numDePaginasAvaliadas!: number;
  numDePaginasSemErros!: number;
  numDePaginasComErros!: number;
  numDePaginasComErrosA!: number;
  numDePaginasComErrosAA!: number;
  numDePaginasComErrosAAA!: number;
  listOfErrors: Record<string, number> = {};

  //Statistics percentages
  percentSemErros: number | undefined;
  percentComErros: number | undefined;
  percentComErrosA: number | undefined;
  percentComErrosAA: number | undefined;
  percentComErrosAAA: number | undefined;
  top10Errors: [string, number][] = [];


  ngOnInit() {

    //valores para as estatisticas
    this.numDePaginasAvaliadas = this.statistics.length;
    this.numDePaginasSemErros = 0;
    this.numDePaginasComErros = 0;
    this.numDePaginasComErrosA = 0;
    this.numDePaginasComErrosAA = 0;
    this.numDePaginasComErrosAAA = 0;
    this.listOfErrors = {};
    this.top10Errors = [];
    
    //percentagens para as estatisticas
    this.percentSemErros = 0;
    this.percentComErros = 0;
    this.percentComErrosA = 0;
    this.percentComErrosAA = 0;
    this.percentComErrosAAA = 0;


    const id = this.route.snapshot.paramMap.get('id')!;
    this.websiteService.getWebsite(id).subscribe((website: any | null) => {
      if (website) {
        this.website = website;
        this.pages = website.pages;
        this.website_id = website.id;
        console.log("WebsiteId: ", id);
        if(website.status === "Avaliado"){
          this.websiteService.getStatistics(id).subscribe((statistics: any | null) => {
            this.statistics = statistics;
            this.updateStatistics();
          });
        }
      }
    });
  }

  updatePages() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.websiteService.getWebsite(id).subscribe((website: any | null) => {
      if (website) {
        this.pages = website.pages;
      }
    });
  }

  updateStatistics(){
    this.numDePaginasAvaliadas = this.statistics.length;


    this.statistics.forEach((statistic: Statistic, index: number) => {
      if(statistic.hasErros === false){
       this.numDePaginasSemErros++;
      }else{
        this.numDePaginasComErros++;
      }

      if(statistic.hasErrosA === true){
        this.numDePaginasComErrosA++;
      }
      if(statistic.hasErrosAA === true){
        this.numDePaginasComErrosAA++;
      }
      if(statistic.hasErrosAAA === true){
        this.numDePaginasComErrosAAA++;
      }

      for (var i = 0; i < statistic.errorList.length; i++){
        let error = statistic.errorList[i];
      
        if (this.top10Errors.hasOwnProperty(error)) {
          this.listOfErrors[error]++;
        } else {
          this.listOfErrors[error] = 1;
        }
      }
    });

    this.percentSemErros = (this.numDePaginasSemErros / this.numDePaginasAvaliadas) * 100;
    this.percentComErros = (this.numDePaginasComErros / this.numDePaginasAvaliadas) * 100;
    this.percentComErrosA = (this.numDePaginasComErrosA / this.numDePaginasAvaliadas) * 100;
    this.percentComErrosAA = (this.numDePaginasComErrosAA / this.numDePaginasAvaliadas) * 100;
    this.percentComErrosAAA = (this.numDePaginasComErrosAAA / this.numDePaginasAvaliadas) * 100;  
    
    let entries = Object.entries(this.listOfErrors);
    entries.sort((a, b) => b[1] - a[1]);

    this.top10Errors = entries.slice(0, 10);
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

  evaluateSelectedPages() {
    const selectedPages = this.website.pages.filter(page => page.selected);
    this.websiteService.evaluatePages(this.website, selectedPages).subscribe((evaluationResults: String[] | null) => {
      console.log('evaluationResults:', evaluationResults); // Add this line
      if (evaluationResults) {
        for (let i = 0; i < selectedPages.length; i++) {
          selectedPages[i].conformity = evaluationResults[i];
          console.log("Page " + selectedPages[i].id + " evaluated with conformity: " + selectedPages[i].conformity);
        }
      }
    });
    this.conformity = "Evaluation done"; // tem que ser mudado para os valores da avaliação
    this.status = "Avaliado";
    console.log("Evaluation done");
  }

  showTime(time: Date){
    return new Date(time).toUTCString();
  }

  checkAll(check: boolean){
    let array = document.querySelectorAll('.cbox');
    
    if(this.cboxCheck === false){
      
      for (var i = 0; i < array.length; i++){
        let a = array[i] as HTMLInputElement;
        a.checked = true;
      }
    }
    else{
      for (var i = 0; i < array.length; i++){
        let a = array[i] as HTMLInputElement;
        a.checked = false;
      }
    }
    this.cboxCheck = !this.cboxCheck;
  }

  getPageFromUrl(url: string | null){
    for (var i = 0; url !== null && i < this.pages.length; i++){
      if(url === this.pages[i].url){
        return this.pages[i];
      }
    }
    return null;
  }

  DeleteAllPages(){
    let array = document.querySelectorAll('.rowDel');

    for (var i = 0; i < array.length; i++){
      let a = array[i].children[0].firstChild as HTMLInputElement;

      if (a.checked === true){
        let text = array[i].children[1].textContent;
        let page = this.getPageFromUrl(text);

        if( page !== null){
          this.websiteService.deletePage(page, this.website).subscribe((res) => {
            console.log(res);
            this.updatePages();
          });
        }       
      }
    }
  }

  
}

