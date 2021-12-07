# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
### Products
- Index - GET /products - Return a JSON list with all the products in store.
- Show - GET /products/:id - Return a JSON object of a product with the id, parameter :id should be an integer.
- Create [token required] - POST /products - Add a new product to the store, the request body is a JSON object with keys below,
 the created product will be returned.
##### Request Body Keys
| Key                    | Type   | Description                        |
|------------------------|--------|------------------------------------|
| name                   | String | The name of the new product        |
| price                  | Number | The price of the new product       |
| category (optional)    | String | The category of the new product    |
| description (optional) | String | The description of the new product |

##### Example Request Body
```json
{
  "name": "apple",
  "price": 2,
  "category": "fruit",
  "description": "Fresh apple"
}
```

- Top 5 most popular products - GET /products/topFive - Return a JSON list with the top
5 products with the most orders.
- Products by category - GET /products/category/:category - Return a JSON list with all the products with 
category :category in store, the parameter :category should be a string.

#### Response Body Keys for a Product
| Key                    | Type    | Description                    |
|------------------------|---------|--------------------------------|
| id                     | Integer | The ID of the product          |
| name                   | String  | The name of the product        |
| price                  | Number  | The price of the product       |
| category (optional)    | String  | The category of the product    |
| description (optional) | String  | The description of the product |

#### Example Response Body for a Product
```json
{
  "id": 1,
  "name": "apple",
  "price": 2,
  "category": "fruit",
  "description": "Fresh apple"
}
```

### Users
- CREATE - POST /users - Create a new user to the store, the request body is a JSON object with keys below, 
a token for the user that could be used for authorization will be returned.

##### Request Body Keys
| Key        | Type   | Description                    |
|------------|--------|--------------------------------|
| first_name | String | The first name of the new user |
| last_name  | String | The last name of the new user  |
| password   | String | The password of the new user   |

No two users with same first name and last name can be created.

##### Example Request Body
```json
{
  "first_name": "Amy",
  "last_name": "White",
  "password": "******"
}
```

##### Response Body
```json
{
  "token": <token>
}
```

- Index [token required] - GET /users - Return a JSON list with all the users.
- Show [token required] - GET /users/:id - Return a JSON object of a user with the id, parameter :id should be an integer.

#### Response Body Keys for a User
| Key        | Type    | Description                    |
|------------|---------|--------------------------------|
| id         | Integer | The ID of the user             |
| first_name | String  | The first name of the new user |
| last_name  | String  | The last name of the new user  |

#### Example Response Body for a User
```json
{
  "id": 1,
  "first_name": "Amy",
  "last_name": "White"
}
```

- Login - POST /users/login - Log in the user to the store, the request body is the same of CREATE,
  a token for the user that could be used for authorization will be returned.

### Orders
- AddProduct [token required] - POST /orders/addProduct - Add a product of selected quantity to the active order 
of the user.

##### Request Body Keys
| Key       | Type    | Description                               |
|-----------|---------|-------------------------------------------|
| productId | Integer | The id of the product to add to the order |
| quantity  | Number  | The quantity of the product               |

##### Example Request Body
```json
{
  "productId": 9,
  "quantity": 12
}
```

##### Response Body Keys
| Key       | Type    | Description                                 |
|-----------|---------|---------------------------------------------|
| id        | Integer | The id of the order_product pair            |
| order_id  | Integer | The id of the order the product is added to |
| productId | Integer | The id of the product to add to the order   |
| quantity  | Number  | The quantity of the product                 |

#### Example Response Body
```json
{
  "id": 6,
  "order_id": 13,
  "product_id": 9,
  "quantity": 12
}
```

- RemoveProduct [token required] - DELETE /orders/removeProduct/:productId - Delete the product in the active order
with product ud :productId, return a JSON object same as AddProduct, of OrderProduct of the deleted OrderProduct.

- ChangeQuantity [token required] - PUT /orders/changeQuantity - Update the quantity of the given product in the active
order, the request and response body is the same as AddProduct.

- CompleteOrder [token required] - PUT /orders/closeActive - Set the status of the active order for the user to 
"Complete", the updated order will be returned.

#### Example Response Body
```json
{
  "id": 13,
  "user_id": 17,
  "status": "completed"
}
```

- ShowActiveOrder [token required] - GET /orders/activeOrder - Get the information about the current "active" order 
of the user, with the products in the order.
- ShowCompletedOrders [token required] - GET /orders/completedOrders - Return a JSON list of the information about 
all the "complete" orders of the user, with products in the orders.

##### Response Body Keys for an Order
| Key      | Type    | Description                                                                   |
|----------|---------|-------------------------------------------------------------------------------|
| id       | Integer | The id of the order                                                           |
| user_id  | Integer | The id of the user the owns the order                                         |
| products | List    | A list of all the product in the order, each with the product_id and quantity |

#### Example Response Body for an Order
```json
{
    "id": 13,
    "user_id": 17,
    "products": [
        {
            "product_id": 10,
            "quantity": 1
        },
        {
            "product_id": 9,
            "quantity": 12
        }
    ]
}
```

## Authentication
Authentication is needed for all [token required] API endpoints, the authentication token will be returned 
when creating a user or log in. The token should be put in the header ``Authentication: Bearer <token>``.

## Data Shapes
### Product
- id
- name
- price
- category

### User
- id
- firstName
- lastName
- password

### Orders
- id
- user_id
- status of order (active or complete), one user have and only have one active order

### Order_products
- id
- order_id
- product_id
- quantity

## Database Schema
### Products
```sql
create table products
(
    id          serial primary key,
    name        varchar(50)      not null,
    price       double precision not null,
    category    varchar(50),
    description varchar
);
```

### Users
```sql
create table users
(
    id         serial primary key,
    first_name varchar(50)  not null,
    last_name  varchar(50)  not null,
    password   varchar(100) not null,
    constraint unique_username
        unique (first_name, last_name)
);
```

### Orders
```sql
create table orders
(
    id      serial primary key,
    user_id integer     not null references users(id),
    status  varchar(10) not null
);
```

### Order_products
```sql
create table order_products
(
    id         serial primary key,
    order_id   integer not null references orders(id),
    product_id integer not null references products(id),
    quantity   integer not null,
    constraint unique_orderid_productid
        unique (order_id, product_id)
);
```
