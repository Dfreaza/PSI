import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebsiteService } from '../website.service';
import { IWebsite } from '../website';
import { WebsiteViewComponent } from '../website-view/website-view.component';

@Component({
  selector: 'app-website-deletion',
  templateUrl: './website-deletion.component.html',
  styleUrls: ['./website-deletion.component.css']
})
export class WebsiteDeletionComponent implements OnInit{
  constructor(private router: Router, private websiteService: WebsiteService, private websiteView: WebsiteViewComponent) { }
  websites: IWebsite[] = [];
  cboxCheck: boolean = false;

  ngOnInit() {
    this.websiteService.getWebsites().subscribe((webs: IWebsite[]) => {
      this.websites = webs;
    });
  }

  goToPage(site: IWebsite){
    this.websiteView.goToPage(site);
  }

  goToDetails(site: IWebsite){
    this.websiteView.goToDetails(site);
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
  DeleteAll(){
    //falta função de verificação
    let array = document.querySelectorAll('.rowDel');

    for (var i = 0; i < array.length; i++){
      let a = array[i].children[0].firstChild as HTMLInputElement;

      if (a.checked === true){
        let text = array[i].children[1].textContent;
        this.websiteView.deleteWebsite(this.getWebsiteFromUrl(text));
      }
    }
  }

  getWebsiteFromUrl(url: string | null){
    for (var i = 0; url !== null && i < this.websites.length; i++){
      if(url === this.websites[i].url){
        return this.websites[i];
      }
    }
    return null;
  }

  enableButton(){
    let array = document.querySelectorAll('.cbox');
    for (var i = 0; i < array.length; i++){
      let a = array[i] as HTMLInputElement;
      if (a.checked === true){return false}
    }
    return true;
  }
}
