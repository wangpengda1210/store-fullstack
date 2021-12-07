import supertest from 'supertest';
const app = require('../../server');

const request = supertest(app);

describe('Test the product endpoints', () => {
    let token: String;

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
                done();
            })
            .catch(e => done.fail(e));
    });

    describe('Test POST /products', () => {
        it('should return 401 if no authentication token provided',
            function (done) {
            request.post('/products')
                .send({
                    'name': 'orange',
                    'price': 1
                })
                .expect(401)
                .end((err) => {
                    if (err) {
                        return done.fail('Successful access without authentication');
                    }
                    done();
                });
        });

        it('should return 400 if no name provided',
            function (done) {
                request.post('/products')
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        'price': 1
                    })
                    .expect(400)
                    .end((err) => {
                        if (err) {
                            return done.fail('Successful added product with no name');
                        }
                        done();
                    });
        });

        it('should return 400 if no price provided',
            function (done) {
                request.post('/products')
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        'name': 'orange'
                    })
                    .expect(400)
                    .end((err) => {
                        if (err) {
                            return done.fail('Successful added product with no price');
                        }
                        done();
                    });
        });

        it('should return correct name and price for the product',
            function (done) {
                request.post('/products')
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        'name': 'orange',
                        'price': 1
                    })
                    .expect(200)
                    .then(response => {
                        expect(response.body.name).toEqual('orange');
                        expect(response.body.price).toEqual(1);
                        expect(response.body.category).toBeFalsy();
                        done();
                    })
                    .catch(e => done.fail(e));
        });

        it('should allow category for product',
            function (done) {
                request.post('/products')
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        'name': 'apple',
                        'price': 2,
                        'category': 'fruit'
                    })
                    .expect(200)
                    .then(response => {
                        expect(response.body.category).toEqual('fruit');
                        done();
                    })
                    .catch(e => done.fail(e));
        });
    });

    let productId: Number;

    describe('Test GET /products', () => {
        it('should return all products added',
            function (done) {
                request.get('/products')
                    .then(response => {
                        const firstProduct = response.body[0];
                        expect(response.body[0].name).toEqual('orange');
                        productId = firstProduct.id;
                        done();
                    })
                    .catch(e => done.fail(e));
            });
    });

    describe('Test GET /products/:id', () => {
        it('should return correct product',
            function (done) {
                request.get('/products/' + productId)
                    .then(response => {
                        expect(response.body.id).toEqual(productId);
                        expect(response.body.name).toEqual('orange');
                        expect(response.body.price).toEqual(1);
                        expect(response.body.category).toBeFalsy();
                        done();
                    })
                    .catch(e => done.fail(e));
            });
    });

    describe('Test GET /products/category/:category', () => {
        beforeAll(done => {
            request.post('/products')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    'name': 'banana',
                    'price': 3,
                    'category': 'fruit'
                }).then(_ => {
                    request.post('/products')
                        .set('Authorization', 'Bearer ' + token)
                        .send({
                            'name': 'grapes',
                            'price': 2.5,
                            'category': 'fruit'
                        })
                        .then(_ => {
                            request.post('/products')
                                .set('Authorization', 'Bearer ' + token)
                                .send({
                                    'name': 'cucumber',
                                    'price': 3.5,
                                    'category': 'vegetable'
                                })
                                .end(err => {
                                    if (err) {
                                        done.fail(err);
                                    }
                                    done();
                                });
                        })
                        .catch(e => done.fail(e));
            }).catch(e => done.fail(e));
        })

        it('should return all products in category',
            function (done) {
                request.get('/products/category/fruit')
                    .then(response => {
                        expect(response.body.length).toEqual(3);
                        expect(response.body[0].name).toEqual('apple');
                        expect(response.body[1].name).toEqual('banana');
                        done();
                    })
                    .catch(e => done.fail(e));
            });
    });
});