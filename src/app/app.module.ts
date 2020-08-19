import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './_components/sidebar/sidebar.component';
import { UsersComponent } from './_components/user-components/users/users.component';
import { DetailsComponent } from './_components/user-components/details/details.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AgmCoreModule } from '@agm/core'
import { ProductsComponent } from './_components/product-components/products/products.component';
import { UploadFileService } from './_services/upload-file.service';
import { BasicAuthHttpInterceptorService } from './_services/basic-auth-http-interceptor.service';
import { UploadFileComponent } from './_components/upload-file/upload-file.component';
import { GoogleMapsComponent } from './_components/google-maps/google-maps.component';
import { gmaps_environment } from '../environments/gmaps_environment';
import { AddUserComponent } from './_components/user-components/add-user/add-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductFormComponent } from './_components/product-components/product-form/product-form.component';
import { UserLoginComponent } from './_components/user-components/user-login/user-login.component';
import { EditUserComponent } from './_components/user-components/edit-user/edit-user.component';


import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';

import { DeferLoadModule } from '@trademe/ng-defer-load';
import { ProductDetailsComponent } from './_components/product-components/product-details/product-details.component';

import { MatSliderModule } from '@angular/material/slider';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';

import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { MessagesComponent } from './_components/messages/messages.component';
import { MessageDetailsComponent } from './_components/message-details/message-details.component';
import { ChatComponent } from './_components/chat/chat.component';
import { UploadMultipleFilesComponent } from './_components/upload-multiple-files/upload-multiple-files.component';
import { InfoWindowProductOverviewComponent } from './_components/info-window-product-overview/info-window-product-overview.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AddDormComponent } from './_components/add-dorm/add-dorm.component';
import { AddProductComponent } from './_components/product-components/add-product/add-product.component';


HttpClientModule
@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    UsersComponent,
    DetailsComponent,
    ProductsComponent,
    UploadFileComponent,
    GoogleMapsComponent,
    AddUserComponent,
    ProductFormComponent,
    UserLoginComponent,
    EditUserComponent,
    ProductDetailsComponent,
    MessagesComponent,
    MessageDetailsComponent,
    ChatComponent,
    UploadMultipleFilesComponent,
    InfoWindowProductOverviewComponent,
    AddDormComponent,
    AddProductComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,

    ImageCropperModule,
   

    DeferLoadModule,
    //Angular Material inputs (spezielle UI Elemente)
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSelectModule,
    MatCardModule,
    MatTooltipModule,
    MatChipsModule,
    MatIconModule,
    MatExpansionModule,

    MDBBootstrapModule,

    AgmCoreModule.forRoot({
      apiKey: gmaps_environment.GMAPS_API_KEY // The API KEY belongs to Georg and can't be exposed on GITHUB (Hackers are crazy) 
      //-> Therefore it's loaded as a variable from the file gmaps_environment.ts in folder environments. gmaps_environment.ts is in .gitignore, so it won't get pushed to git
    })
  ],
  providers: [
    UploadFileService, 
    {provide:HTTP_INTERCEPTORS, useClass:BasicAuthHttpInterceptorService, multi:true},
    {provide: MAT_DATE_LOCALE, useValue: 'de-DE'}   // without this line the date-picker in product-details would be in US format: 07/20/2020 - https://stackoverflow.com/questions/55721254/how-to-change-mat-datepicker-date-format-to-dd-mm-yyyy-in-simplest-way    https://material.angular.io/components/datepicker/overview 
  ], 
  
    
  bootstrap: [AppComponent],
  
})
export class AppModule { }
