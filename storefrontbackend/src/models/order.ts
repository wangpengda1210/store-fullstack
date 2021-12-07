import Client from '../database';

export type Order = {
  id: Number;
  user_id: Number;
  status: String;
};

export type OrderProduct = {
  id: Number;
  order_id: Number;
  product_id: Number;
  quantity: Number;
};

export class OrderStore {
  /**
   * Create a new active order for the given user
   * @param userId The user the new order belongs to
   */
  async create(userId: Number): Promise<Order> {
    const sql =
      'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *';
    try {
      const conn = await Client.connect();
      const result = await conn.query(sql, [userId, 'active']);

      conn.release();
      return result.rows[0];
    } catch (e) {
      throw new Error(
        `Could not create order with user_id ${userId}, error: ${e}`
      );
    }
  }

  /**
   * Set the active order of a user to completed
   * @param userId The id of the user to change order status
   */
  async completeOrder(userId: Number): Promise<Order> {
    const sql =
      'UPDATE orders SET status=($1) WHERE user_id=($2) AND status=($3) RETURNING *';
    try {
      const conn = await Client.connect();
      const result = await conn.query(sql, ['complete', userId, 'active']);

      conn.release();

      // Create a new active order for the user
      await this.create(userId);
      return result.rows[0];
    } catch (e) {
      throw new Error(`Could not complete with user_id ${userId}, error: ${e}`);
    }
  }

  /**
   * Add product to an order
   * @param userId The id of the user of this active order
   * @param productId The id of the product to be added to the order
   * @param quantity The quantity of the product to be added to the order
   */
  async addProduct(
    userId: Number,
    productId: Number,
    quantity: Number
  ): Promise<OrderProduct> {
    try {
      // Get the active order for the user
      const sql = 'SELECT * FROM orders WHERE user_id=($1) AND status=($2)';

      const conn = await Client.connect();
      const result = await conn.query(sql, [userId, 'active']);

      const orderId = result.rows[0].id;

      const sql_product =
        'SELECT * FROM order_products WHERE order_id=($1) AND product_id=($2)';
      const product_result = await conn.query(sql_product, [
        orderId,
        productId,
      ]);

      let result_insert;
      if (product_result.rows.length) {
        const newQuantity = product_result.rows[0].quantity + quantity;
        const sql_update =
          'UPDATE order_products SET quantity=($1) WHERE product_id=($2) AND order_id=($3) RETURNING *';
        result_insert = await conn.query(sql_update, [
          newQuantity,
          productId,
          orderId,
        ]);
      } else {
        const sql_insert =
          'INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *';
        result_insert = await conn.query(sql_insert, [
          orderId,
          productId,
          quantity,
        ]);
      }

      conn.release();
      return result_insert.rows[0];
    } catch (e) {
      throw new Error(
        `Could not add product to the user ${userId}, with product_id ${productId} and quantity ${quantity}, error: ${e}`
      );
    }
  }

  /**
   * Remove a product from an order
   * @param userId The id of the user of this active order
   * @param productId The id of the product to be added to the order
   */
  async removeProduct(
    userId: Number,
    productId: String
  ): Promise<OrderProduct> {
    try {
      const sql = 'SELECT * FROM orders WHERE user_id=($1) AND status=($2)';

      const conn = await Client.connect();
      const result = await conn.query(sql, [userId, 'active']);

      const orderId = result.rows[0].id;

      const sql_delete =
        'DELETE FROM order_products WHERE order_id=($1) AND product_id=($2) RETURNING *';
      const result_delete = await conn.query(sql_delete, [orderId, productId]);

      conn.release();
      return result_delete.rows[0];
    } catch (e) {
      throw new Error(
        `Could not delete product from the user ${userId}, with product_id ${productId}, error: ${e}`
      );
    }
  }

  /**
   * Change the quantity of a product in the order
   * @param userId The id of the user of this active order
   * @param productId The id of the product to be added to the order
   * @param quantity The quantity of the product to be added to the order
   */
  async changeQuantity(
    userId: Number,
    productId: Number,
    quantity: Number
  ): Promise<OrderProduct> {
    try {
      const sql = 'SELECT * FROM orders WHERE user_id=($1) AND status=($2)';

      const conn = await Client.connect();
      const result = await conn.query(sql, [userId, 'active']);

      const orderId = result.rows[0].id;

      const sql_update =
        'UPDATE order_products SET quantity=($1) WHERE product_id=($2) AND order_id=($3) RETURNING *';
      const result_update = await conn.query(sql_update, [
        quantity,
        productId,
        orderId,
      ]);

      conn.release();
      return result_update.rows[0];
    } catch (e) {
      throw new Error(
        `Could not update product quantity to the user ${userId}, with product_id ${productId} and quantity ${quantity}, error: ${e}`
      );
    }
  }

  /**
   * Get the active order for a user, with the products in the order
   * @param userId The id of the user
   */
  async showActiveOrder(userId: Number): Promise<{
    id: Number;
    user_id: Number;
    products: { product_id: Number; quantity: Number }[];
  }> {
    try {
      // Get the active order for the user
      const sql = 'SELECT * FROM orders WHERE user_id=($1) AND status=($2)';

      const conn = await Client.connect();
      const result = await conn.query(sql, [userId, 'active']);

      const orderId = result.rows[0].id;

      // Get the products in this order
      const join_sql =
        'SELECT op.product_id, op.quantity FROM orders o INNER JOIN order_products op on o.id = op.order_id WHERE o.id = ($1)';
      const products = await conn.query(join_sql, [orderId]);

      conn.release();
      return {
        id: orderId,
        user_id: result.rows[0].user_id,
        products: products.rows,
      };
    } catch (e) {
      throw new Error(
        `Could not get the active order for user ${userId}, error: ${e}`
      );
    }
  }

  /**
   * Get the completed orders for a user, with the products in the order
   * @param userId The id of the user
   */
  async showCompletedOrders(userId: Number): Promise<
    {
      id: Number;
      user_id: Number;
      products: { product_id: Number; quantity: Number }[];
    }[]
  > {
    try {
      // Get the completed orders for the user
      const sql = 'SELECT * FROM orders WHERE user_id=($1) AND status=($2)';

      const conn = await Client.connect();
      const result = await conn.query(sql, [userId, 'complete']);

      const completedOrders = result.rows;
      const orders: {
        id: Number;
        user_id: Number;
        products: { product_id: Number; quantity: Number }[];
      }[] = [];
      for (const order of completedOrders) {
        const orderId = order.id;

        // Get the products in this order
        const join_sql =
          'SELECT op.product_id, op.quantity FROM orders o INNER JOIN order_products op on o.id = op.order_id WHERE o.id = ($1)';
        const products = await conn.query(join_sql, [orderId]);

        orders.push({
          id: orderId,
          user_id: order.user_id,
          products: products.rows,
        });
      }

      conn.release();
      return orders;
    } catch (e) {
      throw new Error(
        `Could not get the complete orders for user ${userId}, error: ${e}`
      );
    }
  }
}
