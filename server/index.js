const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5001;

const mysql = require("mysql2");

app.use(express.json());
app.use(cors());

const pool = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "todoapp",
  })
  .promise();

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("select * from todo");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("서버에러");
  }
});

app.post("/api/todos", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "title no" });
    }
    const [result] = await pool.query("insert into todo (title) values (?)", [
      title,
    ]);

    const insertId = result.insertId;
    const [newTodo] = await pool.query("select * from todo where id =?", [
      insertId,
    ]);

    res.status(201).json(newTodo[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("서버에러");
  }
});

app.get("/api/todos", async (req, res) => {
  try {
    const [rows] = await pool.query("select * from todo order by id asc");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("서버에러");
  }
});

app.get("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("select * from todo where id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "todo not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("서버에러");
  }
});

app.put("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const [rows] = await pool.query("select * from todo where id = ? ", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    const currentTodo = rows[0];
    const newTitle = title !== undefined ? title : currentTodo.title;
    const newCompleted =
      completed !== undefined ? completed : currentTodo.completed;

    await pool.query("update todo set title = ?, completed =? where id =?", [
      newTitle,
      newCompleted,
      id,
    ]);

    const [updatedRows] = await pool.query("select * from todo where id =?", [
      id,
    ]);
    res.json(updatedRows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("서버에러");
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("delete from todo where id =? ", [id]);
    if (!result.affectedRows === 0) {
      return res.status(404).json({ error: "todo not found" });
    }
    res.json({ message: "todo succesfullt" });
  } catch (err) {
    console.error(err);
    res.status(500).send("서버에러");
  }
});

app.listen(PORT, () => {
  console.log(`${PORT} 실행`);
});
