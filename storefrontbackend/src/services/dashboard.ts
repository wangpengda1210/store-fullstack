import Client from '../database';

export class DashboardQueries {
  /**
   * Get the five most ordered product from the store
   */
  async topFiveProducts(): Promise<
    {
      id: Number;
      name: String;
      price: Number;
      category: String | null;
      count: Number;
    }[]
  > {
    try {
      const sql =
        'SELECT p.id, p.name, p.price, p.category, count(p.id) AS num_orders FROM products p INNER JOIN order_products op on p.id = op.product_id GROUP BY p.id ORDER BY num_orders DESC LIMIT 5';
      const conn = await Client.connect();
      const result = await conn.query(sql);

      conn.release();
      return result.rows;
    } catch (e) {
      throw new Error(`Could not get top five products, error: ${e}`);
    }
  }
}
