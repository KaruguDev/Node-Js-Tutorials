const request = require('supertest')
const expect = require('expect')
const sinon = require('sinon')
const {ObjectID} = require('mongodb')
const bcrypt = require('bcryptjs')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {todos, populateTodos, text, new_id, users, populateUsers} = require('./seed/seed')

beforeEach(populateUsers)
beforeEach(populateTodos)

describe('POST /todos', () => {
  it('should create a new todo', (done) => {

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toEqual(text)
      })
      .end((err, res) => {
        if(err){
          return done(err)
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBeGreaterThanOrEqual(1)
          expect(todos[0]).toMatchObject({text})
          done()
        }).catch((e) => done(e))
      })
    })
  it('should not create todo with invalid body data', (done) => {
    //blank request
    request(app)
      .post('/todos')
      .send()
      .expect(400)
      .end((err) => {return done(err)})
  })
})

describe('GET /todos', () => {
  it('should get todo', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
          expect(res.body.todos.length).toBeGreaterThanOrEqual(2)
        })
      .end(done)
  })
})

describe('GET /todos/:id', () => {
  it('should return a todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done)
  })

  it('should return 404 and id is valid', (done) => {
    request(app)
      .get(`/todos/${new_id.toHexString()}`)
      .expect(404)
      .end(done)
  })

  it('should return 404 and id is invalid', (done) => {
    request(app)
      .get(`/todos/c1v1lwar`)
      .expect(404)
      .end(done)
  })
})

describe('DELETE /todos/:id', () => {
  it('should delete a todo doc', (done) => {
    var todo_id = todos[2]._id.toHexString()
    request(app)
      .delete(`/todos/${todo_id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[2].text)
      })
      .end((err, res) => {
        if(err){
          return done(err)
        }
        //check to see if the doc exists
        Todo.findById(todo_id).then((n) => {
          expect(n).toBeNull()
          done()
        })
      })
  })

  it('should return 404 and id is valid', (done) => {
    request(app)
      .delete(`/todos/${new_id.toHexString()}`)
      .expect(404)
      .end(done)
  })

  it('should return 404 and id is invalid', (done) => {
    request(app)
      .delete(`/todos/av3ng3rs`)
      .expect(404)
      .end(done)
  })
})

describe('PATCH /todos/:id', () => {
  it('should update todo doc', (done) => {
    var todo_id = todos[1]._id.toHexString()
    var body = {text: 'test todo doc update', completed: false}

    request(app)
      .patch(`/todos/${todo_id}`)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(body.text)
        expect(res.body.todo.completed).toBeFalsy()
        expect(res.body.todo.completedAt).toBeNull()
      })
      .end(done)
  })
  it('should return 404 and id is valid',(done) => {
    request(app)
      .patch('/todos/${new_id}')
      .send()
      .expect(404)
      .end(done)
  })
  it('should return 404 and id is invalid',(done) => {
    request(app)
      .patch('/todos/d13hard')
      .send()
      .expect(404)
      .end(done)
  })
})

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe(users[0].email)
      })
      .end(done)
  })

  it('should return 401 authentication failed', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({})
      })
      .end(done)
  })
})

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'test3@example.com'
    var password = 'test123!'

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeDefined()
        expect(res.body.email).toBe(email)
      })
      .end(done)
  })

  it('should return validation errors if request invalid', (done) => {
    var email = 'test4example.com'
    var password = 'test'

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .expect((res) => {
        expect(res.body._message).toBe('User validation failed')
      })
      .end(done)

  })

  it('should not create user if email is in use', (done) => {
    var data = {email:users[0].email, password:users[0].password}
    request(app)
      .post('/users')
      .send(data)
      .expect(400)
      .expect((res) => {
        expect(res.body.code).toBe(11000)
      })
      .end(done)
  })
})
