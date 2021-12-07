import supertest from 'supertest';
const app = require('../../server');

const request = supertest(app);

describe('Test GET /products/topFive', () => {
    it('should the most ordered product should be displayed first', function (done) {
        request
            .get('/products/topFive')
            .expect(200)
            .then(response => {
                expect(response.body[0].name).toEqual('banana');
                done();
            })
            .catch(e => done.fail(e));
    });
});