import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from "@angular/common";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {FormsModule} from "@angular/forms";
import {SocialAuthServiceConfig} from 'angularx-social-login';
import {SocialLoginModule,GoogleLoginProvider} from 'angularx-social-login';
import { MyhomeComponent } from './myhome/myhome.component';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MyhomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SocialLoginModule,
    CommonModule
  ],
  providers: [{
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(
            '478097800660-6ahj0253t1ceae1ap7cnlhhakvlrlaa7.apps.googleusercontent.com'
          )
        }]
      } as SocialAuthServiceConfig
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
