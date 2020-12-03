import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';
import firebase from 'firebase';
import { ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { AuthGuardService } from './auth-guard.service';
import { FileuploadComponent } from './fileupload/fileupload.component';

firebase.initializeApp(environment.firebaseConfig)
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    FileuploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot([
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'home',
        component: HomeComponent,
        canActivate:[AuthGuardService]
      },
      {
        path: 'upload',
        component: FileuploadComponent,
        canActivate:[AuthGuardService]
      }
    ]),
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
