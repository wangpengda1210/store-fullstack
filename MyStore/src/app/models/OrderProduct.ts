export class OrderProduct {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;

  constructor() {
    this.id = 1;
    this.order_id = 1;
    this.product_id = 1;
    this.quantity = 1;
  }
}
