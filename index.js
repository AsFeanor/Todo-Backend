const express = require('express');
const app = express();
const pool = require('./db');
var cors = require('cors');

app.use(express.json()); // --> req.body
app.use(cors());

// Routes

// get all todos

app.get('/todos', async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo");

        res.json(allTodos.rows);
    } catch (err) {
        console.log(err.message);
    }
});

// get a todo

app.get("/todos/:id", async (req, res) => {
    const {id} = req.params
    try{
        const todo = await pool.query(
            "SELECT * FROM todo WHERE todo_id = $1",
            [id]
        );

        res.json(todo.rows[0])
    }catch (err){
        console.log(err.message);
    }
});

// create a todo

app.post('/todos', async(req,res) => {
    try{
        const { description } = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES ($1) RETURNING *",
            [description]
        );

        res.json(newTodo.rows[0]);
    }catch (err){
        console.log(err.message);
    }
})

// update a todo

app.put("/todos/:id", async (req, res) => {
   try{
        const { id } = req.params; // where
        const { description } = req.body; // update/set

        const updateTodo = await pool.query(
            "UPDATE todo SET description = $1 WHERE todo_id = $2",
            [description,id]
        );

        res.json('todo was updated')
   } catch (err) {
       console.log(err.message);
   }
});

// delete a todo

app.delete('/todos/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const deleteTodo = await pool.query(
            "DELETE FROM todo WHERE todo_id = $1",
        [id]
        );

        res.json('Todo was successfully deleted!');
    }catch (err){
        console.log(err.message);
    }
});

app.delete('/todos', async (req, res) => {
    try{
        const {id} = req.params;
        const deleteTodo = await pool.query(
            "DELETE FROM todo WHERE todo_id > 0",
        );

        res.json('Todos was successfully deleted!');
    }catch (err){
        console.log(err.message);
    }
});

app.listen(5000, () => {
    console.log('server is listening on port 5000');
});
