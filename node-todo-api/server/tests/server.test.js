const request = require('supertest')
const expect = require('expect')
const sinon = require('sinon')

const {app} = require('./../server')
const {todo} = require('./../models/todo')

var text = 'Hey I am test'
var todos = [
  {text: 'this is first to do'},
  {text: 'this is second to do'}
]

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
