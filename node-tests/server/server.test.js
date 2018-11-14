const request = require('supertest');
const expect = require('expect')
const app = require('./server').app;

describe('Server', () => {
  describe('GET /', () => {
    it('should return 200', (done) => {
      request(app)
        .get('/')
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            body: 'Hello There'
          })
        })
        .end(done)
    })
  })

  describe('GET /users', () => {
    it('should return users', (done) => {
      request(app)
        .get('/users')
        .expect((res) => {
          expect(res.body).toContainEqual({
            name: 'Paul',
            age: 39
          })
        })
        .end(done)
    })

  })

})
