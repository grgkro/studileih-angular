import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsComponent } from './_components/user-components/details/details.component';
import { UsersComponent } from './_components/user-components/users/users.component';
import { ProductsComponent } from './_components/product-components/products/products.component';
import { GoogleMapsComponent } from './_components/google-maps/google-maps.component';
import { AddUserComponent } from './_components/user-components/add-user/add-user.component';
import { ProductDetailsComponent } from './_components/product-components/product-details/product-details.component';
import { UploadFileComponent } from './_components/upload-file/upload-file.component';
import { AdminComponent } from './_components/admin/admin/admin.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddProductComponent } from './_components/product-components/add-product/add-product.component';
import { LoginOverviewComponent } from './_components/login-overview/login-overview.component';

import { EditUserComponent } from './_components/user-components/edit-user/edit-user.component';

import { ProductResolverService } from 'src/app/_services/product-resolver.service';
import { MessagesComponent } from './_components/messages/messages.component';
import { ChatComponent } from './_components/chat/chat.component';

const routes: Routes = [
  {
    path: 'add-product',
    component: AddProductComponent
  },
  {
    path: 'product-details/:id',
    component: ProductDetailsComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  },

  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'add-user',
    component: AddUserComponent
  },
  {
    path: 'edit-user/:id',
    component: EditUserComponent
  },
  {
    path: 'details/:id',
    component: DetailsComponent
  },
  {
    path: 'user-login',
    component: LoginOverviewComponent
  },
  {
    path: 'messages',
    component: MessagesComponent
  },
  {
    path: 'chat/:id',
    component: ChatComponent
  },
  {
    path: 'upload-userPic',
    component: UploadFileComponent
  },
  {
    path: 'google-maps',
    component: GoogleMapsComponent
  }, 
  { 
    path: '', component: ProductsComponent, resolve: { products: ProductResolverService } 
 },
  { path: '**', redirectTo: '', pathMatch: 'full' } // = wildcard route: A well-functioning application should gracefully handle when users attempt to navigate to a part of your application that does not exist. To add this functionality to your application, you set up a wildcard route. The Angular router selects this route any time the requested URL doesn't match any router paths. Common choices include an application-specific PageNotFoundComponent, which you can define to display a 404 page to your users; or a redirect to your application's main component. A wildcard route is the last route because it matches any URL.
];

@NgModule({
  imports: [RouterModule.forRoot(routes), FormsModule, ReactiveFormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
