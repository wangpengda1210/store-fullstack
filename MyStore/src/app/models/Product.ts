export class Product {
  id: number;
  name: string;
  price: number;
  category: string | null;
  description: string | null;

  constructor() {
    this.id = 1;
    this.name = '';
    this.price = 0;
    this.category = null;
    this.description = null;
  }
}
