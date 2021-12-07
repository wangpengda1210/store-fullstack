import Client from '../database';

export type Product = {
  id: Number;
  name: String;
  price: Number;
  category: String | null;
  description: String | null;
};

export class ProductStore {
  /**
   * Get the list of all orders in store
   */
  async index(): Promise<Product[]> {
    const sql = 'SELECT * FROM products';

    try {
      const conn = await Client.connect();
      const result = await Client.query(sql);

      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get products, error: ${err}`);
    }
  }

  /**
   * Get the product with the given id
   * @param id The id of the product
   */
  async show(id: String): Promise<Product> {
    const sql = 'SELECT * FROM products WHERE id = ($1)';

    try {
      const conn = await Client.connect();
      const result = await Client.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (e) {
      throw new Error(`Could not get product with id ${id}, error: ${e}`);
    }
  }

  /**
   * Save the given product into database
   * @param product The product to save
   */
  async create(product: Product): Promise<Product> {
    const sql =
      'INSERT INTO products (name, price, category, description) VALUES ($1, $2, $3, $4) RETURNING *';

    try {
      const conn = await Client.connect();
      const result = await Client.query(sql, [
        product.name,
        product.price,
        product.category,
        product.description
      ]);

      conn.release();
      return result.rows[0];
    } catch (e) {
      throw new Error(
        `Could not create product with name ${product.name}, error: ${e}`
      );
    }
  }

  /**
   * Get all products with the given category
   * @param category The category to find
   */
  async getByCategory(category: String): Promise<Product[]> {
    const sql = 'SELECT * FROM products WHERE category=($1)';

    try {
      const conn = await Client.connect();
      const result = await Client.query(sql, [category]);

      conn.release();
      return result.rows;
    } catch (e) {
      throw new Error(
        `Could not get products with category ${category}, error: ${e}`
      );
    }
  }
}
