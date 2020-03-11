const request = require('supertest')
const expect = require('expect')
const sinon = require('sinon')
const {ObjectID} = require('mongodb')
const bcrypt = require('bcryptjs')

const {app} = require('./../server')
const {User} = require('./../models/user')
const {Todo} = require('./../models/todo')
const {todos, populateTodos, text, new_id, users, populateUsers} = require('./seed/seed')

beforeEach(populateUsers)
beforeEach(populateTodos)


describe('POST /users', () => {
  it('should create a user', (done) => {
    let email = "test@example.com"
    let password = "pw4test!"

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
    let email = 'test4example.com'
    let password = 'test'

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
    let data = {email:users[0].email, password:users[0].password}
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

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({email:users[0].email, password:users[0].password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeDefined()
      })
      .end((err, res) => {
        if(err){
          return done(err)
        }

        User.findById(res.body._id).then((user) => {
          expect(user.tokens[1]).toMatchObject({
            access: 'auth',
            token: res.headers['x-auth']
          })
          done()
        }).catch((e) => done(e))
      })

  })

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({email:'xys@example.com', password:'pw4xys'})
      .expect(400)
      .end((err, res) => {
        if(err){
          return done(err)
        }

        expect(res.headers['x-auth']).not.toBeDefined()
        done()
      })
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

describe('DELETE /users/logout', () => {
  it('should not remove auth token if not authenticated', (done) => {
    request(app)
      .delete('/users/logout')
      .expect(401)
      .end(done)
  })

  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/logout')
      .set('x-auth', users[2].tokens[0].token)
      .expect(200)
      .expect((res) => {
          expect(res.headers['x-auth']).not.toBeDefined()
        })
      .end(done)
  })
})


describe('POST /todos', () => {
  it('should not create a new todo doc if not authenticated', (done) => {
    request(app)
      .post('/todos')
      .send({text, _creator:users[0]._id})
      .expect(401)
      .end(done)
  })

  it('should create a new todo', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text, _creator:users[0]._id})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toEqual(text)
      })
      .end((err, res) => {
        if(err){
          return done(err)
        }

        Todo.find({text, _creator:users[0]._id}).then((todos) => {
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
      .set('x-auth', users[0].tokens[0].token)
      .send()
      .expect(400)
      .end((err) => {return done(err)})
  })
})

describe('GET /todos', () => {
  it('should not get todos if not authenticated', (done) => {
    request(app)
      .get('/todos')
      .expect(401)
      .end(done)
  })

  it('should get todo', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
          expect(res.body.todos.length).toBeGreaterThanOrEqual(1)
        })
      .end(done)
  })
})

describe('GET /todos/:id', () => {
  it('should not get a todo doc if not authenticated', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(401)
      .end(done)
  })

  it('should return a todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done)
  })

  it('should return 404 and id is valid', (done) => {
    request(app)
      .get(`/todos/${new_id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  })

  it('should return 404 and id is invalid', (done) => {
    request(app)
      .get(`/todos/c1v1lwar`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  })
})

describe('DELETE /todos/:id', () => {
  it('should not delete a todo doc if not authenticated', (done) => {
    request(app)
      .delete(`/todos/${todos[0]._id.toHexString()}`)
      .expect(401)
      .end(done)
  })

  it('should delete a todo doc', (done) => {
    let todo_id = todos[2]._id.toHexString()
    request(app)
      .delete(`/todos/${todo_id}`)
      .set('x-auth', users[2].tokens[0].token)
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
      .set('x-auth', users[2].tokens[0].token)
      .expect(404)
      .end(done)
  })

  it('should return 404 and id is invalid', (done) => {
    request(app)
      .delete(`/todos/av3ng3rs`)
      .set('x-auth', users[2].tokens[0].token)
      .expect(404)
      .end(done)
  })
})

describe('PATCH /todos/:id', () => {
  it('should not update a todo doc if not authenticated', (done) => {
    let todo_id = todos[1]._id.toHexString()
    let body = {text: 'test todo doc update', completed: false}

    request(app)
      .patch(`/todos/${todo_id}`)
      .send(body)
      .expect(401)
      .end(done)
  })

  it('should update todo doc', (done) => {
    let todo_id = todos[1]._id.toHexString()
    let body = {text: 'test todo doc update', completed: false}

    request(app)
      .patch(`/todos/${todo_id}`)
      .set('x-auth', users[2].tokens[0].token)
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
      .set('x-auth', users[2].tokens[0].token)
      .send()
      .expect(404)
      .end(done)
  })
  it('should return 404 and id is invalid',(done) => {
    request(app)
      .patch('/todos/d13hard')
      .set('x-auth', users[2].tokens[0].token)
      .send()
      .expect(404)
      .end(done)
  })
})
