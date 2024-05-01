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
  DeleteAllWebsites(){
    let array = document.querySelectorAll('.rowDel');
    let websitesToDelete = [];
    let counter = 0;
    const textOne = 'You have selected ';
    const textTwo = ' website(s) that contain 1 or more pages. Do you still wish to delete?';

    for (var i = 0; i < array.length; i++){
      let a = array[i].children[0].firstChild as HTMLInputElement;

      if (a.checked === true){
        let text = array[i].children[1].textContent;
        let website = this.getWebsiteFromUrl(text);

        if(website !== null && website.pages.length > 0){
          counter++;
        }
        websitesToDelete.push(website);        
      }
    }

    if(counter === 0 || (counter > 0 && confirm(textOne + counter + textTwo))){
      for (i = 0; i <  websitesToDelete.length; i++){
        this.websiteView.deleteWebsite(websitesToDelete[i]);
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
