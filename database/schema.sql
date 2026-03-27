USE student_management;

CREATE TABLE students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50),
  email VARCHAR(100),
  course VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SELECT * FROM students;
INSERT INTO students (name, email, course)
VALUES 
('Akhil', 'akhil@gmail.com', 'MCA'),
('Ravi', 'ravi@gmail.com', 'BSc');