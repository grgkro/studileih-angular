import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsComponent } from './_components/details/details.component';
import { UsersComponent } from './users/users.component';
import { ProductsComponent } from './products/products.component';
import { UploadFileComponent } from './_components/upload-file/upload-file.component';
import { GoogleMapsComponent } from './_components/google-maps/google-maps.component';
import { AddUserComponent } from './add-user/add-user.component';
<<<<<<< HEAD
import { AddProductComponent } from './add-product/add-product.component';
=======
import { ProductDetailsComponent } from './_components/product-details/product-details.component';
>>>>>>> d6e9be9ea4719f0ac8ca6cbc8b1531827fac2d38

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent
  },
  {
    path: 'product-details/:id',
    component: ProductDetailsComponent
  },
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'details/:id',
    component: DetailsComponent
  },
  
  {
    path: 'add-product',
    component: AddProductComponent
  },
  {
    path: 'upload-userPic',
    component: UploadFileComponent
  },
  {
    path: 'add-user',
    component: AddUserComponent
  },
  {
    path: 'google-maps',
    component: GoogleMapsComponent
  }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
