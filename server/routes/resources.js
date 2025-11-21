const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all resources (optionally filtered by type or project)
router.get('/', authenticateToken, (req, res) => {
  const { type, project_id } = req.query;
  
  let query = `
    SELECT r.*, p.name as project_name
    FROM resources r
    LEFT JOIN projects p ON r.project_id = p.id
    WHERE 1=1
  `;
  
  const params = [];
  
  if (type) {
    query += ' AND r.type = ?';
    params.push(type);
  }
  
  if (project_id) {
    query += ' AND r.project_id = ?';
    params.push(project_id);
  }
  
  query += ' ORDER BY r.name ASC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching resources' });
    }
    res.json(rows);
  });
});

// Get single resource
router.get('/:id', authenticateToken, (req, res) => {
  const query = `
    SELECT r.*, p.name as project_name
    FROM resources r
    LEFT JOIN projects p ON r.project_id = p.id
    WHERE r.id = ?
  `;

  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching resource' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json(row);
  });
});

// Create resource
router.post('/', [
  authenticateToken,
  body('name').trim().notEmpty(),
  body('type').isIn(['Material', 'Machinery']),
  body('status').optional().isIn(['Available', 'In Use', 'Under Maintenance', 'Unavailable'])
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, type, quantity, unit, status, project_id, description } = req.body;

  db.run(
    `INSERT INTO resources (name, type, quantity, unit, status, project_id, description) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, type, quantity || null, unit || null, status || 'Available', project_id || null, description || null],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error creating resource' });
      }
      res.status(201).json({
        message: 'Resource created successfully',
        resource: { id: this.lastID, name, type, quantity, unit, status, project_id, description }
      });
    }
  );
});

// Update resource
router.put('/:id', [
  authenticateToken,
  body('name').optional().trim().notEmpty(),
  body('type').optional().isIn(['Material', 'Machinery']),
  body('status').optional().isIn(['Available', 'In Use', 'Under Maintenance', 'Unavailable'])
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, type, quantity, unit, status, project_id, description } = req.body;
  const updates = [];
  const values = [];

  if (name) { updates.push('name = ?'); values.push(name); }
  if (type) { updates.push('type = ?'); values.push(type); }
  if (quantity !== undefined) { updates.push('quantity = ?'); values.push(quantity); }
  if (unit !== undefined) { updates.push('unit = ?'); values.push(unit); }
  if (status) { updates.push('status = ?'); values.push(status); }
  if (project_id !== undefined) { updates.push('project_id = ?'); values.push(project_id); }
  if (description !== undefined) { updates.push('description = ?'); values.push(description); }
  updates.push('updated_at = CURRENT_TIMESTAMP');

  values.push(req.params.id);

  db.run(
    `UPDATE resources SET ${updates.join(', ')} WHERE id = ?`,
    values,
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error updating resource' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Resource not found' });
      }
      res.json({ message: 'Resource updated successfully' });
    }
  );
});

// Delete resource
router.delete('/:id', authenticateToken, (req, res) => {
  db.run(`DELETE FROM resources WHERE id = ?`, [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error deleting resource' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json({ message: 'Resource deleted successfully' });
  });
});

module.exports = router;
