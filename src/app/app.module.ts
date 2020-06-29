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
<<<<<<< HEAD


import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

import { DeferLoadModule } from '@trademe/ng-defer-load';
import { ProductDetailsComponent } from './_components/product-details/product-details.component';

=======
import { ProductDetailsComponent } from './product-details/product-details.component';
>>>>>>> 73b855903b69d45879e627630e87981c95e4c0db


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
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,

    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,

    DeferLoadModule,
  
    AgmCoreModule.forRoot({
      apiKey: gmaps_environment.GMAPS_API_KEY // The API KEY belongs to Georg and can't be exposed on GITHUB (Hackers are crazy) 
      //-> Therefore it's loaded as a variable from the file gmaps_environment.ts in folder environments. gmaps_environment.ts is in .gitignore, so it won't get pushed to git
    })
  ],
  providers: [UploadFileService ],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
