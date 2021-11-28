const express = require("express")
const mongoose = require("mongoose")
const exphbs = require("express-handlebars")
const Todo = require("./models/todo")

const app = express()

mongoose.connect("mongodb://localhost/todo-list")

const db = mongoose.connection

db.on('error', () => {
  console.log("mongodb error!")
})

db.once('open', () => {
  console.log("mongodb connected!")
})

app.use(express.urlencoded({ extended: true }))

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')



app.get('/', (req, res) => {
  //取得所有Todo資料
  Todo.find()
    .lean()
    .then(todos => res.render('index', { todos }))
    .catch(error => console.log(error))
})

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
app.listen(3000, () => {
  console.log("App is running on port 3000")
})
