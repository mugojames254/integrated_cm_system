const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { db } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get current user profile
router.get('/profile', authenticateToken, (req, res) => {
  db.get(
    `SELECT id, username, email, role, full_name, phone, created_at 
     FROM users 
     WHERE id = ?`,
    [req.user.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching profile' });
      }
      if (!row) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(row);
    }
  );
});

// Update current user profile
router.put('/profile', [
  authenticateToken,
  body('email').optional().isEmail(),
  body('full_name').optional().trim().notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, full_name, phone } = req.body;
  const updates = [];
  const values = [];

  if (email) { updates.push('email = ?'); values.push(email); }
  if (full_name) { updates.push('full_name = ?'); values.push(full_name); }
  if (phone !== undefined) { updates.push('phone = ?'); values.push(phone); }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  values.push(req.user.id);

  db.run(
    `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
    values,
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: 'Error updating profile' });
      }
      res.json({ message: 'Profile updated successfully' });
    }
  );
});

// Change password
router.put('/change-password', [
  authenticateToken,
  body('current_password').notEmpty(),
  body('new_password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { current_password, new_password } = req.body;

  db.get(
    `SELECT password FROM users WHERE id = ?`,
    [req.user.id],
    async (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }

      const isValidPassword = await bcrypt.compare(current_password, row.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      const hashedPassword = await bcrypt.hash(new_password, 10);

      db.run(
        `UPDATE users SET password = ? WHERE id = ?`,
        [hashedPassword, req.user.id],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Error updating password' });
          }
          res.json({ message: 'Password changed successfully' });
        }
      );
    }
  );
});

// Get all users (for dropdowns, etc.)
router.get('/', authenticateToken, (req, res) => {
  db.all(
    `SELECT id, username, email, role, full_name 
     FROM users 
     ORDER BY full_name ASC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching users' });
      }
      res.json(rows);
    }
  );
});

module.exports = router;
