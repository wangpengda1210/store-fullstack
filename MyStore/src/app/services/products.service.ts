import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Product } from "../models/Product";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

const BACKEND_HOST = environment.backendHost;

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private httpClient: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${BACKEND_HOST}/products`);
  }

  getProduct(id: number): Observable<Product> {
    return this.httpClient.get<Product>(`${BACKEND_HOST}/products/${id}`);
  }
}
