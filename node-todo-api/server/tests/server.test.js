const request = require('supertest')
const expect = require('expect')
const sinon = require('sinon')
const {ObjectID} = require('mongodb')

const {app} = require('./../server')
const {todo} = require('./../models/todo')

var text = 'Hey I am test'
var todos = [
  {
    _id: new ObjectID(),
    text: 'this is first to do'
  },
  {
    _id: new ObjectID(),
    text: 'this is second to do'
  },
  {
    _id: new ObjectID(),
    text: 'i should be deleted'
  }
]

var new_id = new ObjectID()

beforeEach((done) => {
  //delete todos
  todo.find({text},todos[0],todos[1]).then((res) => {
    if(res.length >= 1){
      todo.deleteMany({text}).then(() => {},(err) => {return err})
      todo.deleteMany(todos[0]).then(() => {},(err) => {return err})
      todo.deleteMany(todos[1]).then(() => {},(err) => {return err})
    }
  })
  //Insert todos
  todo.insertMany(todos).then(()=>{},(err) => {return err})
  return done()
})

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

        todo.find({text}).then((todos) => {
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
    request(app)
      .delete(`/todos/${todos[2]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[2].text)
      })
      .end(done)
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
