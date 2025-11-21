const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all tasks (optionally filtered by project)
router.get('/', authenticateToken, (req, res) => {
  const { project_id } = req.query;
  
  let query = `
    SELECT t.*, 
           u.full_name as assigned_to_name,
           p.name as project_name
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    LEFT JOIN projects p ON t.project_id = p.id
  `;
  
  const params = [];
  
  if (project_id) {
    query += ' WHERE t.project_id = ?';
    params.push(project_id);
  }
  
  query += ' ORDER BY t.due_date ASC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching tasks' });
    }
    res.json(rows);
  });
});

// Get single task
router.get('/:id', authenticateToken, (req, res) => {
  const query = `
    SELECT t.*, 
           u.full_name as assigned_to_name,
           p.name as project_name
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE t.id = ?
  `;

  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching task' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(row);
  });
});

// Create task
router.post('/', [
  authenticateToken,
  body('project_id').isInt(),
  body('title').trim().notEmpty(),
  body('due_date').isDate(),
  body('status').isIn(['Pending', 'In Progress', 'Completed', 'Blocked']),
  body('priority').optional().isIn(['Low', 'Medium', 'High', 'Critical'])
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { project_id, title, description, due_date, assigned_to, status, priority } = req.body;

  db.run(
    `INSERT INTO tasks (project_id, title, description, due_date, assigned_to, status, priority) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [project_id, title, description || null, due_date, assigned_to || null, status, priority || 'Medium'],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error creating task' });
      }
      res.status(201).json({
        message: 'Task created successfully',
        task: { id: this.lastID, project_id, title, description, due_date, assigned_to, status, priority }
      });
    }
  );
});

// Update task
router.put('/:id', [
  authenticateToken,
  body('title').optional().trim().notEmpty(),
  body('due_date').optional().isDate(),
  body('status').optional().isIn(['Pending', 'In Progress', 'Completed', 'Blocked']),
  body('priority').optional().isIn(['Low', 'Medium', 'High', 'Critical'])
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, due_date, assigned_to, status, priority } = req.body;
  const updates = [];
  const values = [];

  if (title) { updates.push('title = ?'); values.push(title); }
  if (description !== undefined) { updates.push('description = ?'); values.push(description); }
  if (due_date) { updates.push('due_date = ?'); values.push(due_date); }
  if (assigned_to !== undefined) { updates.push('assigned_to = ?'); values.push(assigned_to); }
  if (status) { updates.push('status = ?'); values.push(status); }
  if (priority) { updates.push('priority = ?'); values.push(priority); }
  updates.push('updated_at = CURRENT_TIMESTAMP');

  values.push(req.params.id);

  db.run(
    `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`,
    values,
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error updating task' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json({ message: 'Task updated successfully' });
    }
  );
});

// Delete task
router.delete('/:id', authenticateToken, (req, res) => {
  db.run(`DELETE FROM tasks WHERE id = ?`, [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error deleting task' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  });
});

module.exports = router;
