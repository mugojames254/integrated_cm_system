const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { db } = require('../database/init');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all employees (Admin only)
router.get('/', authenticateToken, requireAdmin, (req, res) => {
  db.all(
    `SELECT id, username, email, role, full_name, phone, created_at 
     FROM users 
     WHERE role = 'Employee'
     ORDER BY full_name ASC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching employees' });
      }
      res.json(rows);
    }
  );
});

// Get single employee
router.get('/:id', authenticateToken, (req, res) => {
  // Admin can view any employee, employees can only view themselves
  if (req.user.role !== 'Admin' && req.user.id !== parseInt(req.params.id)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  db.get(
    `SELECT id, username, email, role, full_name, phone, created_at 
     FROM users 
     WHERE id = ?`,
    [req.params.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching employee' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      res.json(row);
    }
  );
});

// Create employee (Admin only)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('username').trim().isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('full_name').trim().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, full_name, phone } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (username, email, password, role, full_name, phone) 
       VALUES (?, ?, ?, 'Employee', ?, ?)`,
      [username, email, hashedPassword, full_name, phone || null],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Username or email already exists' });
          }
          return res.status(500).json({ error: 'Error creating employee' });
        }

        res.status(201).json({
          message: 'Employee created successfully',
          employee: { id: this.lastID, username, email, role: 'Employee', full_name, phone }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update employee (Admin only)
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('username').optional().trim().isLength({ min: 3 }),
  body('email').optional().isEmail(),
  body('full_name').optional().trim().notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, full_name, phone } = req.body;
  const updates = [];
  const values = [];

  if (username) { updates.push('username = ?'); values.push(username); }
  if (email) { updates.push('email = ?'); values.push(email); }
  if (full_name) { updates.push('full_name = ?'); values.push(full_name); }
  if (phone !== undefined) { updates.push('phone = ?'); values.push(phone); }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  values.push(req.params.id);

  db.run(
    `UPDATE users SET ${updates.join(', ')} WHERE id = ? AND role = 'Employee'`,
    values,
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Username or email already exists' });
        }
        return res.status(500).json({ error: 'Error updating employee' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      res.json({ message: 'Employee updated successfully' });
    }
  );
});

// Delete employee (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  db.run(
    `DELETE FROM users WHERE id = ? AND role = 'Employee'`,
    [req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error deleting employee' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      res.json({ message: 'Employee deleted successfully' });
    }
  );
});

// Get employee tasks
router.get('/:id/tasks', authenticateToken, (req, res) => {
  db.all(
    `SELECT t.*, p.name as project_name
     FROM tasks t
     LEFT JOIN projects p ON t.project_id = p.id
     WHERE t.assigned_to = ?
     ORDER BY t.due_date ASC`,
    [req.params.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching tasks' });
      }
      res.json(rows);
    }
  );
});

module.exports = router;
