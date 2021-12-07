import supertest from 'supertest';
const app = require('../../server');

const request = supertest(app);

describe("Test the auth middleware", () => {
    it('should return 401 when accessing an endpoint requires auth without auth token', function (done) {
        request
            .get('/users')
            .expect(401)
            .end((err) => {
                if (err) {
                    return done.fail('Accessed an endpoint requires auth without auth token');
                }
                done();
            });
    });

    it('should return 401 when accessing an endpoint requires auth with wrong access token', function (done) {
        request
            .get('/users')
            .set('Authorization', 'Bearer not_a_valid_token')
            .expect(401)
            .end((err) => {
                if (err) {
                    return done.fail('Accessed an endpoint requires auth with wrong access token');
                }
                done();
            });
    });
});