import { DashboardQueries } from '../services/dashboard';
import express from 'express';

const store = new DashboardQueries();

const topFiveProducts = async (req: express.Request, res: express.Response) => {
  try {
    const products = await store.topFiveProducts();
    res.json(products);
  } catch (e) {
    res.status(400).json({ error: `${e}` });
  }
};

const dashboard_route = (app: express.Application) => {
  app.get('/products/topFive', topFiveProducts);
};

export default dashboard_route;
