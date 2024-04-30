import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebsiteComponent } from './website/website.component';
import { AddPageComponent } from './add-page/add-page.component';
import { WebsiteViewComponent } from './website-view/website-view.component';
import { WebsiteDetailsComponent } from './website-details/website-details.component';
import { WebsiteDeletionComponent } from './website-deletion/website-deletion.component';

@NgModule({
  declarations: [
    AppComponent,
    WebsiteComponent,
    AddPageComponent,
    WebsiteViewComponent,
    WebsiteDetailsComponent,
    WebsiteDeletionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [WebsiteComponent, WebsiteViewComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }