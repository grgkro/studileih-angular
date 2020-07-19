import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PostsComponent } from './_components/posts/posts.component';
import { UsersComponent } from './users/users.component';
import { DetailsComponent } from './_components/details/details.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AgmCoreModule } from '@agm/core'
import { ProductsComponent } from './products/products.component';
import { UploadFileService } from './_services/upload-file.service';
import { UploadFileComponent } from './_components/upload-file/upload-file.component';
import { GoogleMapsComponent } from './_components/google-maps/google-maps.component';
import { gmaps_environment } from '../environments/gmaps_environment';
import { AddUserComponent } from './add-user/add-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddProductComponent } from './add-product/add-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { EditUserComponent } from './edit-user/edit-user.component';


import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

import { DeferLoadModule } from '@trademe/ng-defer-load';
import { ProductDetailsComponent } from './_components/product-details/product-details.component';

import { MatSliderModule } from '@angular/material/slider';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatTooltipModule} from '@angular/material/tooltip';

import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { MessagesComponent } from './_components/messages/messages.component';
import { MessageDetailsComponent } from './_components/message-details/message-details.component';
import { ChatComponent } from './_components/chat/chat.component';
import { UploadMultipleFilesComponent } from './_components/upload-multiple-files/upload-multiple-files.component';
import { InfoWindowProductOverviewComponent } from './_components/info-window-product-overview/info-window-product-overview.component';



HttpClientModule
@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    PostsComponent,
    UsersComponent,
    DetailsComponent,
    ProductsComponent,
    UploadFileComponent,
    GoogleMapsComponent,
    AddUserComponent,
    AddProductComponent,
    EditProductComponent,
    UserLoginComponent,
    EditUserComponent,
    ProductDetailsComponent,
    MessagesComponent,
    MessageDetailsComponent,
    ChatComponent,
    UploadMultipleFilesComponent,
    InfoWindowProductOverviewComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
   

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

    AgmSnazzyInfoWindowModule,
    AgmCoreModule.forRoot({
      apiKey: gmaps_environment.GMAPS_API_KEY // The API KEY belongs to Georg and can't be exposed on GITHUB (Hackers are crazy) 
      //-> Therefore it's loaded as a variable from the file gmaps_environment.ts in folder environments. gmaps_environment.ts is in .gitignore, so it won't get pushed to git
    })
  ],
  providers: [UploadFileService ],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
