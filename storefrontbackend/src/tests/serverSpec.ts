import supertest from 'supertest';
import dotenv from "dotenv";
const app = require('../server');

const request = supertest(app);
dotenv.config();

it('Test the server can be connected', (done) => {
  request
    .get('/')
    .expect(200)
    .end((err) => {
      if (err) {
        return done.fail('Server not responding');
      }
      console.log(process.env.ENV)
      done();
    });
});
