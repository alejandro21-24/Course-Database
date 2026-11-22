
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create and connect to the university database
const db = new sqlite3.Database(
  path.join(__dirname, 'university.db')
);

// Create the courses table
db.run(`
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    courseCode TEXT,
    title TEXT,
    credits INTEGER,
    description TEXT,
    semester TEXT
  )
`, (err) => {
  if (err) {
    console.error('Error creating table:', err.message);
  } else {
    console.log('University database and courses table created successfully!');
  }

  // Close database connection
  db.close();
});
