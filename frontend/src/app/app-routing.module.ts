import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPageComponent } from './add-page/add-page.component';
import { WebsiteComponent } from './website/website.component';
import { WebsiteViewComponent } from './website-view/website-view.component';
import { WebsiteDetailsComponent } from './website-details/website-details.component';


const routes: Routes = [
  {path: '', component: WebsiteComponent },
  {path: 'add-page', component: AddPageComponent},
  {path: 'websites', component: WebsiteViewComponent},
  {path: 'website-details', component: WebsiteDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
