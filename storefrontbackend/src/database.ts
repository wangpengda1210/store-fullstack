import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const {
  AWS_DB_HOST,
  AWS_DB_NAME,
  AWS_DB_TEST_NAME,
  AWS_DB_USER,
  AWS_DB_PASSWORD,
  ENV,
} = process.env;

let Client = new Pool();

if (ENV === 'dev') {
  Client = new Pool({
    host: AWS_DB_HOST,
    database: AWS_DB_NAME,
    user: AWS_DB_USER,
    password: AWS_DB_PASSWORD,
  });
} else if (ENV === 'test') {
  Client = new Pool({
    host: AWS_DB_HOST,
    database: AWS_DB_TEST_NAME,
    user: AWS_DB_USER,
    password: AWS_DB_PASSWORD,
  });
}

export default Client;
