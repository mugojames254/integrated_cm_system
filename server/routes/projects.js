const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all projects
router.get('/', authenticateToken, (req, res) => {
  const query = `
    SELECT p.*, u.full_name as creator_name
    FROM projects p
    LEFT JOIN users u ON p.created_by = u.id
    ORDER BY p.created_at DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching projects' });
    }
    res.json(rows);
  });
});

// Get single project
router.get('/:id', authenticateToken, (req, res) => {
  const query = `
    SELECT p.*, u.full_name as creator_name
    FROM projects p
    LEFT JOIN users u ON p.created_by = u.id
    WHERE p.id = ?
  `;

  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching project' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(row);
  });
});

// Create project
router.post('/', [
  authenticateToken,
  body('name').trim().notEmpty(),
  body('start_date').isDate(),
  body('end_date').isDate(),
  body('status').isIn(['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'])
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, start_date, end_date, status } = req.body;

  db.run(
    `INSERT INTO projects (name, description, start_date, end_date, status, created_by) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, description || null, start_date, end_date, status, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error creating project' });
      }
      res.status(201).json({
        message: 'Project created successfully',
        project: { id: this.lastID, name, description, start_date, end_date, status }
      });
    }
  );
});

// Update project
router.put('/:id', [
  authenticateToken,
  body('name').optional().trim().notEmpty(),
  body('start_date').optional().isDate(),
  body('end_date').optional().isDate(),
  body('status').optional().isIn(['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'])
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, start_date, end_date, status } = req.body;
  const updates = [];
  const values = [];

  if (name) { updates.push('name = ?'); values.push(name); }
  if (description !== undefined) { updates.push('description = ?'); values.push(description); }
  if (start_date) { updates.push('start_date = ?'); values.push(start_date); }
  if (end_date) { updates.push('end_date = ?'); values.push(end_date); }
  if (status) { updates.push('status = ?'); values.push(status); }
  updates.push('updated_at = CURRENT_TIMESTAMP');

  values.push(req.params.id);

  db.run(
    `UPDATE projects SET ${updates.join(', ')} WHERE id = ?`,
    values,
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error updating project' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json({ message: 'Project updated successfully' });
    }
  );
});

// Delete project
router.delete('/:id', authenticateToken, (req, res) => {
  db.run(`DELETE FROM projects WHERE id = ?`, [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error deleting project' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  });
});

// Get project statistics
router.get('/:id/stats', authenticateToken, (req, res) => {
  const projectId = req.params.id;

  db.get(
    `SELECT 
      (SELECT COUNT(*) FROM tasks WHERE project_id = ?) as total_tasks,
      (SELECT COUNT(*) FROM tasks WHERE project_id = ? AND status = 'Completed') as completed_tasks,
      (SELECT COUNT(*) FROM resources WHERE project_id = ?) as total_resources
    `,
    [projectId, projectId, projectId],
    (err, stats) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching statistics' });
      }
      res.json(stats);
    }
  );
});

module.exports = router;
