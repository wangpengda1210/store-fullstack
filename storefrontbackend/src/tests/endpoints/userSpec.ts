import supertest from 'supertest';
const app = require('../../server');

const request = supertest(app);

describe('Test the user endpoints', () => {
    describe('Test POST /users', () => {
        it('should return the token after register', function (done) {
            request.post('/users')
                .send({
                    "first_name": "test_user",
                    "last_name": "test",
                    "password": "secret"
                })
                .expect(200)
                .then(response => {
                    if (response.body.token) {
                        done();
                    } else {
                        done.fail('Token not returned');
                    }
                })
                .catch((e: Error) => {
                    done.fail(e.message)
                });
        });

        it('should return 400 if a user with same first name and second name is used for register', function (done) {
            request.post('/users')
                .send({
                    "first_name": "test_user",
                    "last_name": "test",
                    "password": "secret"
                })
                .expect(400)
                .end((err) => {
                    if (err) {
                        return done.fail('Register successful with the same first name and last name');
                    }
                    done();
                });
        });
    });

    let token: String = "";

    describe('Test POST /users/login', () => {
        it('should login successfully with the registered first name, last name and password', function (done) {
            request.post('/users/login')
                .send({
                    "first_name": "test_user",
                    "last_name": "test",
                    "password": "secret"
                })
                .expect(200)
                .then(response => {
                    if (response.body.token) {
                        token = response.body.token;
                        done();
                    } else {
                        done.fail('Login not successful');
                    }
                })
                .catch(_ => done.fail('Login not successful'));
        });

        it('should return 401 for login with wrong first name', function (done) {
            request.post('/users/login')
                .send({
                    "first_name": "test_user_1",
                    "last_name": "test",
                    "password": "secret"
                })
                .expect(401)
                .end((err) => {
                    if (err) {
                        return done.fail('Login successful with wrong first name');
                    }
                    done();
                });
        });

        it('should return 401 for login with wrong password', function (done) {
            request.post('/users/login')
                .send({
                    "first_name": "test_user",
                    "last_name": "test",
                    "password": "secret1"
                })
                .expect(401)
                .end((err) => {
                    if (err) {
                        return done.fail('Login successful with wrong password');
                    }
                    done();
                });
        });
    });

    let userId: Number;
    let userFirstName: String;

    describe('Test GET /users', () => {
        it('should return a list with one user', function (done) {
            request
                .get('/users')
                .set('Authorization', 'Bearer ' + token)
                .expect(200)
                .then(response => {
                    expect(response.body.length).toEqual(1);
                    expect(response.body[0].first_name).toEqual('test_user');
                    userId = response.body[0].id;
                    userFirstName = response.body[0].first_name;
                    done();
                })
                .catch(e => done.fail(e));
        });
    });

    describe('Test GET /users/:id', () => {
        it('should return the user created with correct first name', function (done) {
            request
                .get('/users/' + userId)
                .set('Authorization', 'Bearer ' + token)
                .expect(200)
                .then(response => {
                    expect(response.body.first_name).toEqual(userFirstName);
                    done();
                })
                .catch(e => done.fail(e));
        });
    });
});