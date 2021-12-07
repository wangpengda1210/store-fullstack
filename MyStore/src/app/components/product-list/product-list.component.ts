import { Component, OnInit } from '@angular/core';
import { ProductsService } from "../../services/products.service";
import { Product } from "../../models/Product";
import { OrderService } from "../../services/order.service";
import { ProductQuantity } from "../../models/ProductQuantity";
import { Router } from "@angular/router";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductsService, private orderService: OrderService, private router: Router) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(res => {
      this.products = res;
    });
  }

  addProduct(product: ProductQuantity) {
    this.orderService.addProduct(product.id, product.quantity)
      .subscribe({
        next: () => {
          window.alert(`${product.quantity} ${product.name} added to the cart.`);
        },
        error: err => {
          console.log(err);
          this.router.navigate(['/error']);
        }
      });
  }

}
