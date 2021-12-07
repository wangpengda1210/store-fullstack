import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import product_route from './handlers/product';
import cors from 'cors';
import order_route from './handlers/order';
import user_route from './handlers/user';
import dashboard_route from './handlers/dashboard';

const app: express.Application = express();

// Enable CORS
app.use(cors());

app.use(bodyParser.json());
dashboard_route(app);
product_route(app);
order_route(app);
user_route(app);

app.get('/', function (req: Request, res: Response) {
  res.send('Hello World!');
});

const port = process.env.port || 8080;

module.exports = app.listen(port, function () {
  console.log(`starting app on: ${port}`);
});
