
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database(
  path.join(__dirname, 'database', 'university.db'),
  (err) => {
    if (err) {
      console.error('Database error:', err.message);
    } else {
      console.log('Connected to university database');
    }
  }
);

// GET all courses
app.get('/api/courses', (req, res) => {
  db.all('SELECT * FROM courses', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET a course by ID
app.get('/api/courses/:id', (req, res) => {
  db.get(
    'SELECT * FROM courses WHERE id = ?',
    [req.params.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: 'Course not found' });
      }
      res.json(row);
    }
  );
});

// POST a new course
app.post('/api/courses', (req, res) => {
  const { courseCode, title, credits, description, semester } = req.body;

  if (!courseCode || !title || !Number.isInteger(credits) ||
      credits <= 0 || !description || !semester) {
    return res.status(400).json({ error: 'Invalid or missing course information' });
  }

  db.run(
    `INSERT INTO courses (courseCode, title, credits, description, semester)
     VALUES (?, ?, ?, ?, ?)`,
    [courseCode, title, credits, description, semester],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        message: 'Course created successfully',
        id: this.lastID
      });
    }
  );
});

// PUT update a course
app.put('/api/courses/:id', (req, res) => {
  const { courseCode, title, credits, description, semester } = req.body;

  if (!courseCode || !title || !Number.isInteger(credits) ||
      credits <= 0 || !description || !semester) {
    return res.status(400).json({ error: 'Invalid or missing course information' });
  }

  db.run(
    `UPDATE courses
     SET courseCode = ?, title = ?, credits = ?, description = ?, semester = ?
     WHERE id = ?`,
    [courseCode, title, credits, description, semester, req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Course not found' });
      }
      res.json({ message: 'Course updated successfully' });
    }
  );
});

// DELETE a course
app.delete('/api/courses/:id', (req, res) => {
  db.run(
    'DELETE FROM courses WHERE id = ?',
    [req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Course not found' });
      }
      res.json({ message: 'Course deleted successfully' });
    }
  );
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
