import { Injectable } from '@angular/core';
import { LoginService } from "./login.service";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { OrderProduct } from "../models/OrderProduct";
import { environment } from "../../environments/environment";

const BACKEND_HOST = environment.backendHost;

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  totalPrice: number = 0;

  constructor(private loginService: LoginService, private httpClient: HttpClient) { }

  getOrderProducts(): Observable<{
    id: number,
    user_id: number,
    products: {
      product_id: number,
      quantity: number
    }[]
  }> {
    return this.httpClient.get<{
      id: number,
      user_id: number,
      products: {
        product_id: number,
        quantity: number
      }[]
    }>(`${BACKEND_HOST}/orders/activeOrder`, { headers: this.loginService.getHeader() });
  }

  addProduct(productId: number, quantity: number): Observable<OrderProduct> {
      return this.httpClient.post<OrderProduct>(`${BACKEND_HOST}/orders/addProduct`, {
        productId: productId,
        quantity: quantity
      }, { headers: this.loginService.getHeader() });
  }

  deleteProduct(productId: number): Observable<OrderProduct> {
    return this.httpClient.delete<OrderProduct>(`${BACKEND_HOST}/orders/removeProduct/${productId}`,
      { headers: this.loginService.getHeader() });
  }

  changeQuantity(productId: number, quantity: number): Observable<OrderProduct> {
    return this.httpClient.put<OrderProduct>(`${BACKEND_HOST}/orders/changeQuantity`, {
      productId: productId,
      quantity: quantity
    }, { headers: this.loginService.getHeader() });
  }

  completeOrder(): Observable<void> {
    return this.httpClient.put<void>(`${BACKEND_HOST}/orders/closeActive`, {},
      {headers: this.loginService.getHeader()});
  }
}
