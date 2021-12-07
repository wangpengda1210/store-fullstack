import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Product } from "../../models/Product";
import { ProductsService } from "../../services/products.service";
import { LoginService } from "../../services/login.service";
import { OrderService } from "../../services/order.service";

@Component({
  selector: 'app-product-item-detail',
  templateUrl: './product-item-detail.component.html',
  styleUrls: ['./product-item-detail.component.css']
})
export class ProductItemDetailComponent implements OnInit {
  product: Product;
  selectQuantity: number = 1 ;

  constructor(private route: ActivatedRoute, private productService: ProductsService, private router: Router,
              private loginService: LoginService, private orderService: OrderService) {
    this.product = {
      id: 0,
      name: '',
      price: 0,
      category: null,
      description: null
    };
  }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: res => {
        // Get the product id from the url
        this.productService.getProduct(res['id']).subscribe({
          next: res => {
            this.product = res;
          },
          error: err => {
            console.log(err);
            this.router.navigate(['/error']);
          }
        })
      },
      error: err => {
        console.log(err);
      }
    });
  }

  addProduct(): void {
    if (this.loginService.isLoggedIn()) {
      const orderProduct = {
        productId: this.product.id,
        quantity: Number(this.selectQuantity)
      };

      if (orderProduct.productId && orderProduct.quantity && orderProduct.quantity >= 1) {
        this.orderService.addProduct(orderProduct.productId, orderProduct.quantity)
          .subscribe({
            next: () => {
              this.selectQuantity = 1;
              window.alert(`${this.product.name} is added to the cart.`);
            },
            error: err => {
              console.log(err);
              this.router.navigate(['/error']);
            }
          })
      } else {
        this.router.navigate(['/error']);
      }
    } else {
      window.alert('Not logged in');
      this.router.navigate(['/login']);
    }
  }

}
