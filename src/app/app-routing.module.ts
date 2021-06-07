import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";

import { MyhomeComponent } from './myhome/myhome.component';

const routes: Routes = [
  {path:"",redirectTo:"/myApp.com",pathMatch:'full'},
  {path:"myApp.com",component:HomeComponent},
  {path:"myhome",component:MyhomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
