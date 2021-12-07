import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../services/login.service";
import {OrderService} from "../../services/order.service";
import {ProductsService} from "../../services/products.service";
import {ProductQuantity} from "../../models/ProductQuantity";
import {Router} from "@angular/router";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartProducts: ProductQuantity[] = [];
  fullName: string | null = this.loginService.username;
  address: string = '';
  cardNumber: string = '';

  totalPrice: number = 0;

  constructor(private loginService: LoginService, private orderService: OrderService,
              private productService: ProductsService, private router: Router) {
  }

  ngOnInit(): void {
    this.getCartProducts();
  }

  getCartProducts(): void {
    if (this.loginService.isLoggedIn()) {
      // Get all id of products in cart
      this.orderService.getOrderProducts().subscribe({
        next: res => {
          this.cartProducts = res.products.map(product => {
            let theProduct: ProductQuantity = {
              category: null, description: null, id: 0, name: "", price: 0, quantity: 0
            };

            // Get the product detail using the product_id
            this.productService.getProduct(product.product_id).subscribe({
              next: res => {
                theProduct.id = res.id;
                theProduct.name = res.name;
                theProduct.price = res.price;
                theProduct.category = res.category;
                theProduct.description = res.description;
                theProduct.quantity = product.quantity;
              },
              complete: () => {
                this.recalculatePrice();
              }
            });

            return theProduct;
          });
        },
        error: err => {
          console.log(err);
        }
      });
      this.recalculatePrice();
    } else {
      window.alert('Not logged in');
      // Redirect to login page if the user is not logged in
      this.router.navigate(['/login']);
    }
  }

  deleteProduct(productId: number): void {
    // Calling the server to delete product
    this.orderService.deleteProduct(productId).subscribe({
      next: value => {
        window.alert(`The item has been deleted`);
        // Filter the local product list
        this.cartProducts = this.cartProducts.filter(product => {
          return product.id !== value.product_id
        });
        this.recalculatePrice();
      },
      error: err => {
        console.log(err);
        this.router.navigate(['/error']);
      }
    });
  }

  submitOrder(): void {
    this.orderService.completeOrder().subscribe({
      next: () => {
        // Navigate to confirmation page
        this.router.navigate(['/confirmation'], {
          queryParams: {
            'fullName': this.fullName,
            'totalPrice': this.totalPrice
          },
          skipLocationChange: true,
          replaceUrl: false
        });
      },
      error: err => {
        console.log(err);
        this.router.navigate(['/error']);
      }
    });
  }

  changeQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) { // The product should be deleted from the cart if the quantity is less or equals 0
      this.deleteProduct(productId);
    } else {
      this.orderService.changeQuantity(productId, quantity).subscribe({
        next: () => {
          this.recalculatePrice();
        },
        error: err => {
          console.log(err);
          this.router.navigate(['/error']);
        }
      });
    }
  }

  // Recalculate the total price of products in cart when item quantity is changed or item is deleted
  recalculatePrice(): void {
    this.totalPrice = 0;
    for (let product of this.cartProducts) {
      this.totalPrice += product.quantity * product.price;
    }
    this.totalPrice = Number(this.totalPrice.toFixed(2));
  }
}
