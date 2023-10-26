const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
require('dotenv').config();

// Access the MongoDB URI
const mongodbUri = process.env.MONGODB_URI;

mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

// Define your Mongoose schema and model here for to-do items
const todoSchema = new mongoose.Schema({
    task: String,
    completed: Boolean,
  });
  
  const Todo = mongoose.model('Todo', todoSchema);

  app.get('/', async (req, res) => {
    try {
      const todos = await Todo.find({});
      res.render('index', { todos: todos });
    } catch (err) {
      console.log(err);
    }
  });
  
  
  app.post('/add', async (req, res) => {
    try {
      const newTask = req.body.newTask;
      const todo = new Todo({ task: newTask, completed: false });
      await todo.save();
      res.redirect('/');
    } catch (err) {
      console.log(err);
    }
  });  
  
  app.post('/delete', async (req, res) => {
    try {
      const todoId = req.body.checkbox;
      await Todo.findByIdAndRemove(todoId);
      res.redirect('/');
    } catch (err) {
      console.log(err);
    }
  });
  
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
