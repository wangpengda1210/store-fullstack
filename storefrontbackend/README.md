# Storefront Backend Project
[![build](https://github.com/wangpengda1210/Storefront-Backend/actions/workflows/main.yml/badge.svg)](https://github.com/wangpengda1210/Storefront-Backend/actions/workflows/main.yml)

A Node JS backend for a store, can be used to manage products, orders and users in a store, 
allow user registration and authentication.

## Used Technologies
The application used the technologies below:
- [Postgres](https://www.postgresql.org/) for the database
- [Node](https://nodejs.org/) / [Express](https://expressjs.com/) for the application logic
- [dotenv from npm](https://www.npmjs.com/package/dotenv) for managing environment variables
- [db-migrate from npm](https://www.npmjs.com/package/db-migrate) for migrations
- [jsonwebtoken from npm](https://www.npmjs.com/package/jsonwebtoken) for working with JWTs
- [bcrypt from npm](https://www.npmjs.com/package/bcrypt) for encrypting password
- [jasmine from npm](https://www.npmjs.com/package/jasmine) and [supertest from npm](https://www.npmjs.com/package/supertest) for testing

## Installation and Database Connection

### 1. Install project requirements
- Install [Node JS](https://nodejs.org/) and [Postgres](https://www.postgresql.org/) on your computer.
- Clone or download this repo.
- In the root of this project, run ```npm install``` to install all the required packages.

### 2.  DB Creation

- [Create development and testing database](https://www.postgresql.org/docs/14/sql-createdatabase.html) in Postgres psql, for example:
```sql
  CREATE DATABASE store_front;
  CREATE DATABASE store_front_test;
```
- [Create user with password](https://www.postgresql.org/docs/14/sql-createuser.html) to manage the two databases and
[grant all privileges](https://www.postgresql.org/docs/14/ddl-priv.html) to the user, for example:
```sql
  CREATE USER store_user WITH password 'password';
  GRANT ALL PRIVILEGES ON DATABASE store_front TO store_user;
  GRANT ALL PRIVILEGES ON DATABASE store_front_test TO store_user;
```
- The database runs on port 5432.

### 3. DB Migration and Connection

- Modify ```template.env``` with environment variables as below:

| Key              | Description                                                             |
|------------------|-------------------------------------------------------------------------|
| AWS_DB_HOST      | The address where the database runs on                                  |
| AWS_DB_NAME      | The name of the database in development environment                     |
| AWS_DB_TEST_NAME | The name of the database in test environment                            |
| AWS_DB_USER      | The username of the user which has all privileges for the two databases |
| AWS_DB_PASSWORD  | The password of the user                                                |
| ENV              | Working environment, "dev" for development, "test" for testing          |
| BCRYPT_PASSWORD  | The password used for encrypting passwords for the users                |
| SALT_ROUNDS      | The hash rounds when encrypting passwords for the users                 |
| JWT_PASSWORD     | The secret for creating JSON Web Token                                  |

- Rename ```template.env``` to ```.env```.
- Run ```npm i -g db-migrate``` in terminal.
- Run ```db-migrate up``` in the root of this project to migrate the database.


### 4. Running and Testing

- Run ```npm run start``` in the root of this project to start the server, the server runs on port 8080.
- The endpoints available can be found [here](REQUIREMENTS.md#api-endpoints).
- Run ```npm run test``` to run the test cases for the project.

