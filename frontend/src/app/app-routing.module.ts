import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPageComponent } from './add-page/add-page.component';
import { WebsiteComponent } from './website/website.component';


const routes: Routes = [
  {path: '', component: WebsiteComponent },
  {path: 'add-page', component: AddPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
