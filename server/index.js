import express from "express";
import pg from "pg";
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})
db.connect();

app.get("/users/:username", async (req, res) => {
    const userName = req.params.username;
    try {
        const result = await db.query('SELECT * FROM users WHERE username=$1', [userName]);
        console.log("result:", result.rows);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post("/users/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await db.query("SELECT * FROM users WHERE username=$1", [username]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not registered",
            });
        }
        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                username: user.username
            }
        });

    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

app.post("/users/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await db.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password]);
        console.log("New user added. Username:", username, " , ", "password:", password);
        res.status(201).json({
            success: true,
            message: "New user added"
        });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.patch("/users/:id", async (req, res) => {
    console.log("PATCH request body: ", req.body);
    const {patchType, username,id}=req.body;

    try {
        const result = await db.query(`UPDATE users SET ${patchType}=$1 WHERE id=$2`, [username, id]);
        console.log("User updates. Username:", username, " , ", "id:", id);
        res.status(200).json({
            success: true,
            message: "User updated"
        });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
