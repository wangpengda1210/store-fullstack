import { UserStore } from '../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import express from 'express';
import authentication from '../middleware/auth';

dotenv.config();
const { JWT_PASSWORD } = process.env;

const store = new UserStore();

const create = async (req: express.Request, res: express.Response) => {
  try {
    const newUser = {
      id: 0,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: req.body.password,
    };

    if (!newUser.first_name) {
      res.status(400).json({ error: `User first name should not be null` });
    } else if (!newUser.last_name) {
      res.status(400).json({ error: `User last name should not be null` });
    } else if (!newUser.password) {
      res.status(400).json({ error: `User password should not be null` });
    } else {
      const user = await store.create(newUser);
      // @ts-ignore
      // Sign the user object with JWT
      const token = jwt.sign(user, JWT_PASSWORD);

      res.json({ token: token });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: `${e}` });
  }
};

const login = async (req: express.Request, res: express.Response) => {
  try {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const password = req.body.password;

    if (!first_name) {
      res.status(400).json({ error: `User first name should not be null` });
    } else if (!last_name) {
      res.status(400).json({ error: `User last name should not be null` });
    } else if (!password) {
      res.status(400).json({ error: `User password should not be null` });
    } else {
      const user = await store.login(first_name, last_name, password);

      if (user) {
        // @ts-ignore
        // Sign the user object with JWT
        const token = jwt.sign(user, JWT_PASSWORD);
        res.json({ token: token });
      } else {
        res.status(401).json('Incorrect username or password');
      }
    }
  } catch (e) {
    res.status(400).json({ error: `${e}` });
  }
};

const index = async (req: express.Request, res: express.Response) => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (e) {
    res.status(400).json({ error: `${e}` });
  }
};

const show = async (req: express.Request, res: express.Response) => {
  try {
    const id = req.params.id;
    const user = await store.show(id);
    if (user) {
      res.json(user);
    } else {
      res.status(400).json({ error: `No user with id ${id}` });
    }
  } catch (e) {
    res.status(400).json({ error: `${e}` });
  }
};

const router = express.Router();

const user_route = (app: express.Application) => {
  router.post('/', create);
  router.post('/login', login);
  router.get('/', authentication, index);
  router.get('/:id', authentication, show);

  app.use('/users', router);
};

export default user_route;
