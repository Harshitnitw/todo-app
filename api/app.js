const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const serverless = require('serverless-http'); // Use serverless-http middleware
const app = express();
require('dotenv').config();

// Use environment variables from 'process.env' provided by the serverless function
const port = process.env.PORT || 3000;
const mongodbUri = process.env.MONGODB_URI;

try {
  mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });  
} catch (error) {
  console.log(error)
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const todoSchema = new mongoose.Schema({
  task: String,
  completed: Boolean,
});

const Todo = mongoose.model('Todo', todoSchema);

// Express routes remain unchanged
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

// Export the Express app using serverless-http middleware
module.exports.handler = serverless(app);
