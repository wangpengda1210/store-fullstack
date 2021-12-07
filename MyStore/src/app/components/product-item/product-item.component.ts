import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from "../../models/Product";
import { LoginService } from "../../services/login.service";
import { Router } from "@angular/router";
import { ProductQuantity } from "../../models/ProductQuantity";

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {
  @Input() product: Product;
  @Output() addProduct: EventEmitter<ProductQuantity> = new EventEmitter;

  selectQuantity: number = 1;

  constructor(private loginService: LoginService, private router: Router) {
    this.product = {
      id: 0,
      name: "",
      price: 0,
      category: null,
      description: null
    };
  }

  ngOnInit(): void {
  }

  submitForm(): void {
    if (this.loginService.isLoggedIn()) {
      const orderProduct = {
        productId: this.product.id,
        quantity: Number(this.selectQuantity)
      };

      if (orderProduct.productId && orderProduct.quantity && orderProduct.quantity >= 1) {
        this.addProduct.emit({
          id: this.product.id,
          name: this.product.name,
          price: this.product.price,
          category: this.product.category,
          description: this.product.description,
          quantity: orderProduct.quantity
        });
        this.selectQuantity = 1;
      }
    } else {
      // Navigate to log in page when the user is not logged in
      window.alert('Not logged in');
      this.router.navigate(['/login']);
    }
  }

}
