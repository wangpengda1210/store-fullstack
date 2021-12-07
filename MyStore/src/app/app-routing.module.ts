import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProductListComponent} from "./components/product-list/product-list.component";
import {CartComponent} from "./components/cart/cart.component";
import {ProductItemDetailComponent} from "./components/product-item-detail/product-item-detail.component";
import {ErrorComponent} from "./components/error/error.component";
import {ConfirmationComponent} from "./components/confirmation/confirmation.component";
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";

const routes: Routes = [{
  path: '',
  component: ProductListComponent
}, {
  path: 'item/:id',
  component: ProductItemDetailComponent
}, {
  path: 'cart',
  component: CartComponent
}, {
  path: 'error',
  component: ErrorComponent
}, {
  path: 'confirmation',
  component: ConfirmationComponent
}, {
  path: 'login',
  component: LoginComponent
}, {
  path: 'register',
  component: RegisterComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
