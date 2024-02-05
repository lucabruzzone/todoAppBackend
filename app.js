const cors = require("cors");
const bodyParser = require("body-parser");
const express = require('express');
const {
    getTodosByID,
    getTodo,
    getSharedTodoByID,
    getUserByID,
    getUserByEmail,
    createTodo,
    deleteTodo,
    toggleCompleted,
    shareTodo
} = require('./database');

const corsOptions = {
    /* origin: "http://localhost:5173", */ // specify the allowed origin
    origin: "*", // specify the allowed origin
    methods: ["POST", "GET", "PUT"], // specify the allowed methods
    credentials: true, // allow sending credentials (cookies, authentication)
};

const app = express();
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(express.json());






app.get("/todo/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const todo = await getTodo(id);
        res.status(200).send(todo);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});

app.get("/todos/:id", async (req, res) => {
    const todos = await getTodosByID(req.params.id);
    res.status(200).send(todos);
});

app.get("/todos/shared_todos/:id", async (req, res) => {
    try {
        const todo = await getSharedTodoByID(req.params.id);
        const todoTitle = await getTodo(todo.todo_id);
        const author = await getUserByID(todo.user_id);
        const shared_with = await getUserByID(todo.shared_with_id);
        res.status(200).send({ todoTitle, author, shared_with });
    } catch (error) {
        res.status(404).send({error: error.message});
    }
});

app.get("/users/:id", async (req, res) => {
    try {
        const user = await getUserByID(req.params.id);
        res.status(200).send(user);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});

app.put("/todos/:id", async (req, res) => {
    try {
        const { value } = req.body;
        const todo = await toggleCompleted(req.params.id, value);
        res.status(200).send(todo);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});

app.delete("/todos/:id", async (req, res) => {
    try {
        await deleteTodo(req.params.id);
        res.send({ message: "Todo deleted successfully" });
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});

app.post("/todos/shared_todos", async (req, res) => {
    try {
        const { todo_id, user_id, email } = req.body;
        const userToShare = await getUserByEmail(email);
        const sharedTodo = await shareTodo(todo_id, user_id, userToShare.id);
        res.status(201).json(sharedTodo);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});

app.post("/todos", async (req, res) => {
    try {
        const { user_id, title } = req.body;
        const todo = await createTodo(user_id, title);
        res.status(201).send(todo);
    } catch (error) {
        res.status(404).send({ error: error.message, detail: 'user not found' });
    }
});






app.listen(8080, () => {
    console.log("server running on port 8080");
});