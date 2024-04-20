import { Component } from '@angular/core';
import { WebsiteService } from '../website.service';

@Component({
  selector: 'app-website',
  templateUrl: './website.component.html'
})
export class WebsiteComponent {
  url: string;

  constructor(private websiteService: WebsiteService) {
    this.url = '';
  }

  addWebsite() {
    this.websiteService.addWebsite(this.url).subscribe(() => {
      this.url = '';
    });
  }

  ackCorrectWebsiteURL() {
    return this.url !== '' && new URL(this.url).hostname !== 'localhost';
  }
}
