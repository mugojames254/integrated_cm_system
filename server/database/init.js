const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'construction_management.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

const initializeDatabase = () => {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('Admin', 'Employee')),
        full_name TEXT,
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Projects table
    db.run(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled')),
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);

    // Tasks table
    db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        due_date DATE NOT NULL,
        assigned_to INTEGER,
        status TEXT NOT NULL CHECK(status IN ('Pending', 'In Progress', 'Completed', 'Blocked')),
        priority TEXT CHECK(priority IN ('Low', 'Medium', 'High', 'Critical')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (assigned_to) REFERENCES users(id)
      )
    `);

    // Resources table (Materials and Machinery)
    db.run(`
      CREATE TABLE IF NOT EXISTS resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('Material', 'Machinery')),
        quantity REAL,
        unit TEXT,
        status TEXT CHECK(status IN ('Available', 'In Use', 'Under Maintenance', 'Unavailable')),
        project_id INTEGER,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
      )
    `);

    // Create default admin user
    const adminPassword = bcrypt.hashSync('admin123', 10);
    const employeePassword = bcrypt.hashSync('employee123', 10);

    db.run(`
      INSERT OR IGNORE INTO users (username, email, password, role, full_name, phone)
      VALUES 
        ('admin', 'admin@construction.com', ?, 'Admin', 'System Administrator', '555-0001'),
        ('john_doe', 'john@construction.com', ?, 'Employee', 'John Doe', '555-0002'),
        ('jane_smith', 'jane@construction.com', ?, 'Employee', 'Jane Smith', '555-0003')
    `, [adminPassword, employeePassword, employeePassword]);

    // Insert sample projects
    db.run(`
      INSERT OR IGNORE INTO projects (id, name, description, start_date, end_date, status, created_by)
      VALUES 
        (1, 'Downtown Office Complex', 'Construction of 15-story office building in downtown area', '2024-01-15', '2025-12-31', 'In Progress', 1),
        (2, 'Highway Bridge Renovation', 'Renovation and strengthening of highway bridge structure', '2024-03-01', '2024-11-30', 'In Progress', 1),
        (3, 'Residential Community Phase 1', 'Development of 50-unit residential community', '2024-02-01', '2025-06-30', 'Planning', 1)
    `);

    // Insert sample tasks
    db.run(`
      INSERT OR IGNORE INTO tasks (id, project_id, title, description, due_date, assigned_to, status, priority)
      VALUES 
        (1, 1, 'Foundation Excavation', 'Complete excavation for building foundation', '2024-02-28', 2, 'Completed', 'High'),
        (2, 1, 'Steel Frame Installation', 'Install structural steel framework for floors 1-5', '2024-06-30', 2, 'In Progress', 'Critical'),
        (3, 1, 'Electrical Wiring - Floor 1', 'Complete electrical wiring for first floor', '2024-08-15', 3, 'Pending', 'Medium'),
        (4, 2, 'Bridge Inspection', 'Complete structural integrity inspection', '2024-03-15', 3, 'Completed', 'Critical'),
        (5, 2, 'Concrete Reinforcement', 'Apply concrete reinforcement to support structures', '2024-09-30', 2, 'In Progress', 'High')
    `);

    // Insert sample resources
    db.run(`
      INSERT OR IGNORE INTO resources (id, name, type, quantity, unit, status, project_id, description)
      VALUES 
        (1, 'Portland Cement', 'Material', 5000, 'bags', 'Available', 1, '50kg bags of Portland cement'),
        (2, 'Steel Rebar', 'Material', 2500, 'tons', 'In Use', 1, 'Reinforcement steel bars'),
        (3, 'Tower Crane', 'Machinery', 1, 'unit', 'In Use', 1, 'Heavy-duty tower crane for high-rise construction'),
        (4, 'Concrete Mixer', 'Machinery', 3, 'units', 'Available', NULL, 'Industrial concrete mixing machines'),
        (5, 'Excavator', 'Machinery', 2, 'units', 'In Use', 2, 'Heavy excavation equipment'),
        (6, 'Concrete', 'Material', 1500, 'cubic meters', 'Available', 2, 'Ready-mix concrete')
    `);

    console.log('Database initialized successfully');
  });
};

module.exports = { db, initializeDatabase };
