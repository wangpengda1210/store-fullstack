import Client from '../database';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { OrderStore } from './order';

dotenv.config();
const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

export type User = {
  id: Number;
  first_name: String;
  last_name: String;
  password: String;
};

export class UserStore {
  /**
   * Create a new user
   * @param user The user to create
   */
  async create(user: User): Promise<{
    id: Number;
    first_name: String;
    last_name: String;
  }> {
    try {
      // Encrypt the password
      const hashedPassword = bcrypt.hashSync(
        user.password + BCRYPT_PASSWORD!,
        parseInt(SALT_ROUNDS!)
      );

      const sql =
        'INSERT INTO users (first_name, last_name, password) VALUES ($1, $2, $3) RETURNING id, first_name, last_name';
      const conn = await Client.connect();
      const result = await conn.query(sql, [
        user.first_name,
        user.last_name,
        hashedPassword,
      ]);

      conn.release();
      const newUser = result.rows[0];

      const store = new OrderStore();
      await store.create(newUser.id);

      return newUser;
    } catch (e) {
      throw new Error(
        `Could not create new user with first_name ${user.first_name} and last_name ${user.last_name}, error ${e}`
      );
    }
  }

  /**
   * Login the user
   * @param first_name The user first name
   * @param last_name The user last name
   * @param password The user password
   */
  async login(
    first_name: String,
    last_name: String,
    password: String
  ): Promise<{
    id: Number;
    first_name: String;
    last_name: String;
  } | null> {
    try {
      const sql =
        'SELECT * FROM users WHERE first_name=($1) AND last_name=($2)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [first_name, last_name]);

      conn.release();
      // Check if the username is correct
      if (result.rows.length) {
        const user = result.rows[0];

        // @ts-ignore
        // Check the password
        if (bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password)) {
          return {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
          };
        }
      }

      return null;
    } catch (e) {
      throw new Error(`Error when log in, error: ${e}`);
    }
  }

  /**
   * Get the list of all users
   */
  async index(): Promise<
    {
      id: Number;
      first_name: String;
      last_name: String;
    }[]
  > {
    try {
      const sql = 'SELECT id, first_name, last_name FROM users';
      const conn = await Client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (e) {
      throw new Error(`Could not get users, error: ${e}`);
    }
  }

  /**
   * Get the user with the given id
   * @param id The id of the user
   */
  async show(id: String): Promise<{
    id: Number;
    first_name: String;
    last_name: String;
  }> {
    try {
      const sql = 'SELECT id, first_name, last_name FROM users WHERE id=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (e) {
      throw new Error(`Could not get user with id ${id}, error: ${e}`);
    }
  }
}
