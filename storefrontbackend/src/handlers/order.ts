import express from 'express';
import { OrderStore } from '../models/order';
import authentication from '../middleware/auth';

const store = new OrderStore();

const completeOrder = async (req: express.Request, res: express.Response) => {
  try {
    // Get user id from locals
    const userId = res.locals.userId;
    const order = await store.completeOrder(userId);
    res.json(order);
  } catch (e) {
    res.status(400).json({ error: `${e}` });
  }
};

const addProduct = async (req: express.Request, res: express.Response) => {
  try {
    const userId = res.locals.userId;
    const productId = req.body.productId;
    const quantity = req.body.quantity;

    if (!productId) {
      res.status(400).json({ error: `Product id should not be null` });
    } else if (!quantity) {
      res.status(400).json({ error: `Quantity should not be null` });
    } else {
      const order_product = await store.addProduct(userId, productId, quantity);
      res.json(order_product);
    }
  } catch (e) {
    res.status(400).json({ error: `${e}` });
  }
};

const removeProduct = async (req: express.Request, res: express.Response) => {
  try {
    const userId = res.locals.userId;
    const productId = req.params.productId;

    if (!productId) {
      res.status(400).json({ error: 'Product id should not be null' });
    } else {
      const removedProduct = await store.removeProduct(userId, productId);
      res.json(removedProduct);
    }
  } catch (e) {
    res.status(400).json({ error: `${e}` });
  }
};

const changeQuantity = async (req: express.Request, res: express.Response) => {
  try {
    const userId = res.locals.userId;
    const productId = req.body.productId;
    const quantity = req.body.quantity;

    if (!productId) {
      res.status(400).json({ error: `Product id should not be null` });
    } else if (!quantity) {
      res.status(400).json({ error: `Quantity should not be null` });
    } else {
      const changedProduct = await store.changeQuantity(
        userId,
        productId,
        quantity
      );
      res.json(changedProduct);
    }
  } catch (e) {
    res.status(400).json({ error: `${e}` });
  }
};

const showActiveOrder = async (req: express.Request, res: express.Response) => {
  try {
    const userId = res.locals.userId;
    const order = await store.showActiveOrder(userId);
    res.json(order);
  } catch (e) {
    res.status(400).json({ error: `${e}` });
  }
};

const showCompletedOrders = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const userId = res.locals.userId;
    const orders = await store.showCompletedOrders(userId);
    res.json(orders);
  } catch (e) {
    res.status(400).json({ error: `${e}` });
  }
};

const router = express.Router();

const order_route = (app: express.Application) => {
  router.post('/addProduct', authentication, addProduct);
  router.put('/closeActive', authentication, completeOrder);
  router.get('/activeOrder', authentication, showActiveOrder);
  router.get('/completedOrders', authentication, showCompletedOrders);
  router.delete('/removeProduct/:productId', authentication, removeProduct);
  router.put('/changeQuantity', authentication, changeQuantity);

  app.use('/orders', router);
};

export default order_route;
