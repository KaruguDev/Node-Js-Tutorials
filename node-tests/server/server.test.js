const request = require('supertest');
const app = require('./server').app;

it('should return 200', (done) => {
  request(app)
    .get('/')
    .expect(200)
    .expect('Hello There')
    .end(done)
})
