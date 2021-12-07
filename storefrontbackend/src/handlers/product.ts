import { Product, ProductStore } from '../models/product';
import express from 'express';
import authentication from '../middleware/auth';

const store = new ProductStore();

const index = async (req: express.Request, res: express.Response) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (e) {
    res.status(400).json({ error: `${e}` });
  }
};

const show = async (req: express.Request, res: express.Response) => {
  try {
    const product = await store.show(req.params.id);

    if (product) {
      // When the product of the given id is not found
      res.json(product);
    } else {
      res.status(400).json({ error: `No product with id ${req.params.id}` });
    }
  } catch (e) {
    res.status(400).json({ error: `${e}` });
  }
};

const create = async (req: express.Request, res: express.Response) => {
  try {
    const newProduct: Product = {
      id: 0,
      name: req.body.name,
      price: parseFloat(req.body.price),
      category: req.body.category,
      description: req.body.description
    };

    if (!newProduct.name) {
      // No 'name' in the request body
      res.status(400).json({ error: `Product name should not be null` });
    } else if (!newProduct.price) {
      // No price in the request body or it is not a number
      res.status(400).json({ error: `Product price should be a number` });
    } else {
      const product = await store.create(newProduct);
      res.json(product);
    }
  } catch (e) {
    res.status(400).json({ error: `${e}` });
  }
};

const getByCategory = async (req: express.Request, res: express.Response) => {
  try {
    const products = await store.getByCategory(req.params.category);
    res.json(products);
  } catch (e) {
    res.status(400).send(`${e}`);
  }
};

const router = express.Router();

const product_route = (app: express.Application) => {
  router.get('/', index);
  router.get('/:id', show);
  router.post('/', authentication, create);
  router.get('/category/:category', getByCategory);

  app.use('/products', router);
};

export default product_route;
