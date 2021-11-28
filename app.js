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


app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')



app.get('/', (req, res) => {
  //取得所有Todo資料
  Todo.find()
    .lean()
    .then(todos => res.render('index', { todos }))
    .catch(error => console.log(error))
})

app.listen(3000, () => {
  console.log("App is running on port 3000")
})
