import supertest from 'supertest';
const app = require('../server');

const request = supertest(app);

it('Test the server can be connected', (done) => {
  request
    .get('/')
    .expect(200)
    .end((err) => {
      if (err) {
        return done.fail('Server not responding');
      }
      done();
    });
});
