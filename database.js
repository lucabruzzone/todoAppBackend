const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
});

async function getTodosByID(id) {
    const result = await pool.query(
    `
    SELECT todos.*, shared_todos.shared_with_id
    FROM todos
    LEFT JOIN shared_todos ON todos.id = shared_todos.todo_id
    WHERE todos.user_id = $1 OR shared_todos.shared_with_id = $2;
    `,
    [id, id]
    );
    const rows = result.rows;
    return rows;
}

async function getTodo(id) {
    const result = await pool.query(`SELECT * FROM todos WHERE id = $1;`, [id]);
    const row = result.rows[0];
    if (row) return row;
    throw Error('Task not found');
}

async function getSharedTodoByID(id) {
    const result = await pool.query(
      `SELECT * FROM shared_todos WHERE todo_id = $1;`,
    [id]
    );
    const row = result.rows[0];
    return row;
}

async function getUserByID(id) {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1;`, [id]);
    const row = result.rows[0];
    if (row) return row;
    throw Error('User not found');
}

async function getUserByEmail(email) {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1;`, [
    email,
    ]);
    const row = result.rows[0];
    return row;
}

async function createTodo(user_id, title) {
    const result = await pool.query(
        `
    INSERT INTO todos (user_id, title)
    VALUES ($1, $2)
      RETURNING *;
    `,
        [user_id, title]
    );
    const newTodo = result.rows[0];
    return getTodo(newTodo.id);
}

async function deleteTodo(id) {
    const result = await pool.query(
        `
    DELETE FROM todos WHERE id = $1;
    `,
        [id]
    );
    const rows = result.rows;
    return rows;
}

async function toggleCompleted(id, value) {
    const newValue = value === true ? 'true' : 'false';
    const result = await pool.query(
        `
    UPDATE todos
    SET completed = $1
    WHERE id = $2;
    `,
        [newValue, id]
    );
    const rows = result.rows;
    return rows;
}


async function shareTodo(todo_id, user_id, shared_with_id) {
    if (parseInt(user_id) === shared_with_id) throw Error("Can't be shared with yourself");
    else {
        const result = await pool.query(
            `
        INSERT INTO shared_todos (todo_id, user_id, shared_with_id) 
        VALUES ($1, $2, $3)
        RETURNING id;
        `,
            [todo_id, user_id, shared_with_id]
        );
        return result.rows[0].id;
    }
}




module.exports = {
    getTodosByID,
    getTodo,
    getSharedTodoByID,
    getUserByID,
    getUserByEmail,
    createTodo,
    deleteTodo,
    toggleCompleted,
    shareTodo
}