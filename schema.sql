CREATE DATABASE todoapp;

\c todoapp;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255)
);

CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    completed BOOLEAN DEFAULT false,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE shared_todos (
    id SERIAL PRIMARY KEY,
    todo_id INTEGER,
    user_id INTEGER,
    shared_with_id INTEGER,
    FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (shared_with_id) REFERENCES users(id) ON DELETE CASCADE
);

-- insert two users into the users TABLE
INSERT INTO users (name, email, password) VALUES ('Beto', 'user1@examples.com', 'password1');
INSERT INTO users (name, email, password) VALUES ('Claire', 'user2@examples.com', 'password2');

INSERT INTO todos (title, user_id) 
VALUES 
('🚴🏻 salir en bici', 1),
('regar las plantas', 1),
('estudiar', 1),
('cocinar para la cena de navidad', 1),
('bañar a los perros', 1),
('repasar para la prueba', 1);
INSERT INTO todos (title, user_id) 
VALUES 
('🚴🏻 salir en bici', 2),
('regar las plantas', 2),
('estudiar', 2),
('cocinar para la cena de navidad', 2),
('bañar a los perros', 2),
('repasar para la prueba', 2);

--share todo 1 of user 1 with user 2
INSERT INTO shared_todos (todo_id, user_id, shared_with_id)
VALUES (1, 1, 2);

--get todos including shared todos by id
SELECT todos.*, shared_todos.shared_with_id
FROM todos
LEFT JOIN shared_todos ON todos.id = shared_todos.todo_id
WHERE todos.user_id = [user_id] OR shared_todos.shared_with_id = [user_id];


