const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

// 🔥 IMPORTANT middleware
app.use(cors());
app.use(express.json());

// 🔐 Secret key
const SECRET_KEY = "mysecretkey";

// 🗄️ MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Akhil@1998", // 🔁 replace with your MySQL password
  database: "student_management",
});

// ✅ Connect DB
db.connect((err) => {
  if (err) {
    console.log("DB connection failed ❌", err);
  } else {
    console.log("Connected to MySQL ✅");
  }
});


// =======================
// 📚 STUDENT APIs
// =======================

// 👉 Get all students
app.get("/students", (req, res) => {
  db.query("SELECT * FROM students", (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});

// 👉 Add student
app.post("/students", (req, res) => {
  const { name, email, course } = req.body;

  db.query(
    "INSERT INTO students (name, email, course) VALUES (?, ?, ?)",
    [name, email, course],
    (err, result) => {
      if (err) return res.send(err);
      res.send("Student added ✅");
    }
  );
});

// 👉 Update student
app.put("/students/:id", (req, res) => {
  const id = req.params.id;
  const { name, email, course } = req.body;

  db.query(
    "UPDATE students SET name=?, email=?, course=? WHERE id=?",
    [name, email, course, id],
    (err, result) => {
      if (err) return res.send(err);
      res.send("Student updated ✅");
    }
  );
});

// 👉 Delete student
app.delete("/students/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    "DELETE FROM students WHERE id=?",
    [id],
    (err, result) => {
      if (err) return res.send(err);
      res.send("Student deleted ✅");
    }
  );
});


// =======================
// 🔐 AUTH APIs
// =======================

// 👉 Signup
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword],
      (err, result) => {
        if (err) return res.send(err);
        res.send("User registered ✅");
      }
    );
  } catch (error) {
    res.send(error);
  }
});

// 👉 Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) return res.send(err);

      if (result.length === 0) {
        return res.send("User not found ❌");
      }

      const user = result[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.send("Wrong password ❌");
      }

      const token = jwt.sign({ id: user.id }, SECRET_KEY);

      res.json({
        message: "Login success ✅",
        token: token,
      });
    }
  );
});


// =======================
// 🚀 SERVER START
// =======================

app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});