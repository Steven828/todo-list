const express = require("express")
const mongoose = require("mongoose")
const exphbs = require("express-handlebars")
const Todo = require("./models/todo")

const app = express()
//連接資料庫
mongoose.connect("mongodb://localhost/todo-list")

const db = mongoose.connection
//取得連線狀態
db.on('error', () => {
  console.log("mongodb error!")
})

db.once('open', () => {
  console.log("mongodb connected!")
})
//載入body-parser
app.use(express.urlencoded({ extended: true }))
//載入handlebars
app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')



app.get('/', (req, res) => {
  //取得所有Todo資料
  Todo.find()
    .lean()
    .then(todos => res.render('index', { todos }))
    .catch(error => console.log(error))
})
//新增功能
app.get('/todos/new', (req, res) => {
  return res.render('new')
})

app.post('/todos', (req, res) => {
  const name = req.body.name
  return Todo.create({ name }) //請mongoose建立並傳入資料
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
  //另一種寫法，先在伺服器端建立實體再存入
  //const todo = new Todo({ name })
  //return todo.save() 
    //.then(() => res.redirect('/'))
    //.catch(error => console.log(error))
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('detail', { todo }))
    .catch(error => console.log(error))
})
//修改功能
app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('edit', { todo }))
    .catch(error => console.log(error))
})

app.post('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  return Todo.findById(id)
    .then(todo => {
      todo.name = name
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})

app.post('/todos/:id/delete', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.listen(3000, () => {
  console.log("App is running on port 3000")
})
