import jwt from 'jsonwebtoken';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const { JWT_PASSWORD } = process.env;

/**
 * The function will check if the user is authorized
 */
const authentication = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const header = req.headers.authorization;
    const token = header?.split(' ')[1];
    // @ts-ignore
    // Verify the token
    jwt.verify(token, JWT_PASSWORD);
    // @ts-ignore
    // Pass the user id down
    res.locals.userId = jwt.decode(token).id;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Authentication failed' });
  }
};

export default authentication;
