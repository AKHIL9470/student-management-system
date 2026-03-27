const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Akhil@1998", // 👉 replace with your MySQL password
  database: "student_management"
});

// Connect DB
db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL ✅");
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend working ✅");
});

// GET all students
app.get("/students", (req, res) => {
  db.query("SELECT * FROM students", (err, result) => {
    if (err) {
      console.log(err);
      return res.send(err);
    }
    res.json(result);
  });
});

// ADD student
app.post("/students", (req, res) => {
  const { name, email, course } = req.body;

  db.query(
    "INSERT INTO students (name, email, course) VALUES (?, ?, ?)",
    [name, email, course],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      res.send("Student added ✅");
    }
  );
});

// DELETE student ✅
app.delete("/students/:id", (req, res) => {
  const id = req.params.id;

  console.log("Deleting ID:", id); // debug

  db.query(
    "DELETE FROM students WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      res.send("Deleted successfully ✅");
    }
  );
});
app.put("/students/:id", (req, res) => {
  const id = req.params.id;
  const { name, email, course } = req.body;

  db.query(
    "UPDATE students SET name=?, email=?, course=? WHERE id=?",
    [name, email, course, id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      res.send("Updated successfully ✅");
    }
  );
});
// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});