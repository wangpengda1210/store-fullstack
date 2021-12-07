import supertest from 'supertest';
import Client from "../../database";
const app = require('../../server');

const request = supertest(app);

describe('Test the order endpoints', () => {
    let token: String;
    let productId1: Number;
    let productId2: Number;
    let productId3: Number;

    beforeAll((done) => {
        request
            .post('/users/login')
            .send({
                "first_name": "test_user",
                "last_name": "test",
                "password": "secret"
            })
            .then(response => {
                token = response.body.token;

                request.post('/products')
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        'name': 'banana',
                        'price': 3,
                        'category': 'fruit'
                    })
                    .then(response => {
                        productId1 = response.body.id;

                        request.post('/products')
                            .set('Authorization', 'Bearer ' + token)
                            .send({
                                'name': 'grapes',
                                'price': 2.5,
                                'category': 'fruit'
                            })
                            .then(response => {
                                productId2 = response.body.id;

                                request.post('/products')
                                    .set('Authorization', 'Bearer ' + token)
                                    .send({
                                        'name': 'cucumber',
                                        'price': 3.5,
                                        'category': 'vegetable'
                                    })
                                    .then(response => {
                                        productId3 = response.body.id;
                                    })
                                    .then(() => done())
                                    .catch(e => done.fail(e));
                            })
                            .catch(e => done.fail(e));
                    })
                    .catch(e => done.fail(e));
            })
            .catch(e => done.fail(e));
    });

    let orderId: Number;
    it('should create a new open order for the created user', async function () {
        const sql = 'SELECT * FROM orders';
        const conn = await Client.connect();
        const result = await conn.query(sql);

        expect(result.rows.length).toEqual(1);
        expect(result.rows[0].status).toEqual('active');
        orderId = result.rows[0].id;
    });

    describe('Test POST /orders/addProduct', () => {
        it('should return correct order id, product id and quantity', function (done) {
            request
                .post('/orders/addProduct')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    "productId": productId1,
                    "quantity": 1
                })
                .expect(200)
                .then(response => {
                    expect(response.body.order_id).toEqual(orderId);
                    expect(response.body.product_id).toEqual(productId1);
                    expect(response.body.quantity).toEqual(1);
                    done();
                })
                .catch(e => done.fail(e));
        });

        it('should return 401 if no authentication token provided', function (done) {
            request
                .post('/orders/addProduct')
                .send({
                    "productId": productId1,
                    "quantity": 1
                })
                .expect(401)
                .end((err) => {
                    if (err) {
                        return done.fail('Successful added product with no auth');
                    }
                    done();
                });
        });

        it('should return 400 if no product id provided', function (done) {
            request
                .post('/orders/addProduct')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    "quantity": 1
                })
                .expect(400)
                .end((err) => {
                    if (err) {
                        return done.fail('Successful added product with no product id');
                    }
                    done();
                });
        });

        it('should return 400 if no quantity provided', function (done) {
            request
                .post('/orders/addProduct')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    "productId": productId1
                })
                .expect(400)
                .end((err) => {
                    if (err) {
                        return done.fail('Successful added product with no quantity');
                    }
                    done();
                });
        });
    });

    let oldOrderId: Number;
    describe('Test PUT /orders/closeActive', () => {
        it('should return the older active order with status "complete"', function (done) {
            request
                .put('/orders/closeActive')
                .set('Authorization', 'Bearer ' + token)
                .expect(200)
                .then(response => {
                    expect(response.body.id).toEqual(orderId);
                    expect(response.body.status).toEqual('complete');
                    done();
                })
                .catch(e => done.fail(e));
        });

        it('should open a new active order for the user', async function () {
            const sql = 'SELECT * FROM orders WHERE status=($1)';
            const conn = await Client.connect();
            const result = await conn.query(sql, ['active']);

            expect(result.rows.length).toEqual(1);
            expect(result.rows[0].status).toEqual('active');
            expect(result.rows[0].id).not.toEqual(orderId);
            oldOrderId = orderId;
            orderId = result.rows[0].id;
        });

        it('should return 401 if no authentication token provided', function (done) {
            request
                .put('/orders/closeActive')
                .expect(401)
                .end((err) => {
                    if (err) {
                        return done.fail('Successful closed order with no auth');
                    }
                    done();
                });
        });
    });

    describe('Test GET /orders/activeOrder', () => {
        beforeAll(done => {
            request
                .post('/orders/addProduct')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    "productId": productId1,
                    "quantity": 1
                }).then(_ => {
                    request
                        .post('/orders/addProduct')
                        .set('Authorization', 'Bearer ' + token)
                        .send({
                            "productId": productId2,
                            "quantity": 2
                        }).then(_ => {
                            request
                                .post('/orders/addProduct')
                                .set('Authorization', 'Bearer ' + token)
                                .send({
                                    "productId": productId3,
                                    "quantity": 3
                                }).then(_ => {
                                    done();
                                })
                                .catch(e => done.fail(e));
                        })
                        .catch(e => done.fail(e));
                })
                .catch(e => done.fail(e));
        });

        it('should return the active order with correct id and products', function (done) {
            request
                .get('/orders/activeOrder')
                .set('Authorization', 'Bearer ' + token)
                .expect(200)
                .then(response => {
                    expect(response.body.id).toEqual(orderId);
                    const products = response.body.products;
                    expect(products.length).toEqual(3);
                    expect(products[0].product_id).toEqual(productId1);
                    expect(products[0].quantity).toEqual(1);
                    expect(products[1].product_id).toEqual(productId2);
                    expect(products[1].quantity).toEqual(2);
                    expect(products[2].product_id).toEqual(productId3);
                    expect(products[2].quantity).toEqual(3);
                    done();
                })
                .catch(e => done.fail(e));
        });

        it('should return 401 if no authentication token provided', function (done) {
            request
                .get('/orders/activeOrder')
                .expect(401)
                .end((err) => {
                    if (err) {
                        return done.fail('Successful get active order with no auth');
                    }
                    done();
                });
        });
    });

    describe('Test GET /orders/completedOrders', () => {
        it('should return correct completed order id and products',
            function (done) {
            request
                .get('/orders/completedOrders')
                .set('Authorization', 'Bearer ' + token)
                .expect(200)
                .then(response => {
                    expect(response.body.length).toEqual(1);
                    expect(response.body[0].id).toEqual(oldOrderId);
                    expect(response.body[0].products.length).toEqual(1);
                    done();
                })
                .catch(e => done.fail(e));
        });

        it('should return correct completed order id and products after close current open order',
            function (done) {
                request
                    .put('/orders/closeActive')
                    .set('Authorization', 'Bearer ' + token)
                    .then(() => {
                        request
                            .get('/orders/completedOrders')
                            .set('Authorization', 'Bearer ' + token)
                            .expect(200)
                            .then(response => {
                                expect(response.body.length).toEqual(2);
                                expect(response.body[1].id).toEqual(orderId);
                                expect(response.body[1].products.length).toEqual(3);
                                done();
                            })
                            .catch(e => done.fail(e));
                    })
                    .catch(e => done.fail(e));
        });

        it('should return 401 if no authentication token provided', function (done) {
            request
                .get('/orders/completedOrders')
                .expect(401)
                .end((err) => {
                    if (err) {
                        return done.fail('Successful get completed orders with no auth');
                    }
                    done();
                });
        });
    });
});