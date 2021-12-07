import { Product } from "./Product";

export class ProductQuantity extends Product {
  quantity: number;

  constructor() {
    super();
    this.quantity = 1;
  }
}
