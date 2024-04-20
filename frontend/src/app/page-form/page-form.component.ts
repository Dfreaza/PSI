import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PageService } from '../page.service';

@Component({
  selector: 'app-page-form',
  templateUrl: './page-form.component.html',
  styleUrls: ['./page-form.component.css']
})
export class PageFormComponent implements OnInit {
  pageForm = new FormGroup({
    url: new FormControl(''),
  });

  constructor(private pageService: PageService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const url = this.pageForm.value.url || ''; // Set a default value of an empty string if url is undefined
    this.pageService.addPage(url).subscribe();
  }
}