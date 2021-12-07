# MyStore

## Description
- An [Angular](https://angular.io/) application for the front end of the store, works with [an express backend](https://github.com/wangpengda1210/Storefront-Backend).
- The user can register and login to their account, browse products in the store, add product to the cart, see the products in cart and delete them, and submit order.

## Installation
### 1. Configure the backend
- [Download](https://github.com/wangpengda1210/Storefront-Backend) the backend for this project.
- Configure the database and backend with the [instructions](https://github.com/wangpengda1210/Storefront-Backend/blob/master/README.md).
- Download the frontend, copy the "migrations" folder to the root of the backend folder.
- Run ```db-migrate up``` in the root of the backend folder to prepare the products.
- Start the backend server at localhost:3000.

### 2. Configure the frontend
- Run ```npm install``` at the root of the frontend folder to install all dependencies.
- Run ```npm install -g @angular/cli```.
- Run ```ng serve``` to start the server at port 4200.
