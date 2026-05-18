const express = require('express');
const cors = require('cors');
const db = require('../database.js');

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 Test route
app.get('/', (req, res) => {
  res.send('PulseBoard Backend Running 🚀');
});

// 🔐 Signup
app.post('/signup', (req, res) => {
  const { name, email, password, role } = req.body;

  // ✅ Required fields
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // ✅ Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // ✅ Password validation
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  let teamId = 1;

  try {
    const existingUser = db.prepare(
      "SELECT * FROM users WHERE email = ?"
    ).get(email);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    db.prepare(`
      INSERT INTO users (name, email, password, role, teamId)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, email, password, role, teamId);

    res.status(201).json({ message: "User created successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔐 Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // ✅ Required fields validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = db.prepare(
      "SELECT * FROM users WHERE email = ? AND password = ?"
    ).get(email, password);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful", user });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 👥 Get Users
app.get('/users', (req, res) => {
  try {
    const users = db.prepare(`
      SELECT id, name, role FROM users
    `).all();

    res.json(users);

  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// 📁 Create Project
app.post('/projects', (req, res) => {
  const { title, createdBy, role } = req.body;

  if (role !== "ADMIN") {
    return res.status(403).json({ message: "Only admin can create projects" });
  }

  if (!title || !createdBy) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    db.prepare(
      "INSERT INTO projects (title, createdBy) VALUES (?, ?)"
    ).run(title, createdBy);

    res.status(201).json({ message: "Project created successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error creating project" });
  }
});

// 📁 Get Projects
app.get('/projects', (req, res) => {
  try {
    const projects = db.prepare("SELECT * FROM projects").all();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects" });
  }
});

// 📝 Create Task (WITH PRIORITY + DEADLINE)
app.post('/tasks', (req, res) => {
  const { title, projectId, assignedTo, role, priority, dueDate } = req.body;

  if (role !== "ADMIN") {
    return res.status(403).json({ message: "Only admin can create tasks" });
  }

  if (!title || !projectId || !assignedTo) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    db.prepare(`
      INSERT INTO tasks (title, projectId, assignedTo, status, priority, dueDate)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      title,
      projectId,
      assignedTo,
      "pending",
      (priority || "MEDIUM").toUpperCase(),
      dueDate || null
    );

    res.json({ message: "Task created successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error creating task" });
  }
});

// 📋 Get Tasks
app.get('/tasks', (req, res) => {
  try {
    const tasks = db.prepare(`
      SELECT tasks.*, users.name as assignedUser
      FROM tasks
      LEFT JOIN users ON tasks.assignedTo = users.id
    `).all();

    res.json(tasks);

  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// 🔄 Update Task Status
app.put('/tasks/:id/status', (req, res) => {
  const { status } = req.body;
  const taskId = req.params.id;

  try {
    db.prepare(`
      UPDATE tasks SET status = ? WHERE id = ?
    `).run(status, taskId);

    res.json({ message: "Status updated" });

  } catch (err) {
    res.status(500).json({ message: "Error updating status" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});