import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsAPI, tasksAPI, resourcesAPI, usersAPI } from '../services/api';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [resources, setResources] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    assigned_to: '',
    status: 'Pending',
    priority: 'Medium'
  });

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const [projectRes, tasksRes, resourcesRes, usersRes] = await Promise.all([
        projectsAPI.getOne(id),
        tasksAPI.getAll(id),
        resourcesAPI.getAll({ project_id: id }),
        usersAPI.getAll()
      ]);

      setProject(projectRes.data);
      setTasks(tasksRes.data);
      setResources(resourcesRes.data);
      setUsers(usersRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching project data:', error);
      setLoading(false);
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      await tasksAPI.create({ ...taskFormData, project_id: parseInt(id) });
      setShowTaskModal(false);
      setTaskFormData({
        title: '',
        description: '',
        due_date: '',
        assigned_to: '',
        status: 'Pending',
        priority: 'Medium'
      });
      fetchProjectData();
    } catch (error) {
      alert('Failed to create task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.delete(taskId);
        fetchProjectData();
      } catch (error) {
        alert('Failed to delete task');
      }
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await tasksAPI.update(taskId, { status: newStatus });
      fetchProjectData();
    } catch (error) {
      alert('Failed to update task status');
    }
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status.toLowerCase().replace(' ', '-')}`;
  };

  if (loading) {
    return <div className="loading">Loading project details...</div>;
  }

  if (!project) {
    return <div className="error">Project not found</div>;
  }

  return (
    <div className="project-detail">
      <div className="breadcrumb">
        <Link to="/projects">Projects</Link> / {project.name}
      </div>

      <div className="project-header card">
        <div>
          <h1>{project.name}</h1>
          <p className="project-description">{project.description || 'No description'}</p>
          <div className="project-meta">
            <span><strong>Start:</strong> {new Date(project.start_date).toLocaleDateString()}</span>
            <span><strong>End:</strong> {new Date(project.end_date).toLocaleDateString()}</span>
            <span><strong>Created by:</strong> {project.creator_name || 'Unknown'}</span>
          </div>
        </div>
        <span className={getStatusClass(project.status)}>{project.status}</span>
      </div>

      <div className="project-content">
        <div className="tasks-section card">
          <div className="section-header">
            <h2>Tasks</h2>
            <button onClick={() => setShowTaskModal(true)} className="btn btn-primary">
              + Add Task
            </button>
          </div>

          <div className="tasks-table">
            {tasks.length === 0 ? (
              <p className="no-data">No tasks found. Add your first task!</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Assigned To</th>
                    <th>Due Date</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(task => (
                    <tr key={task.id}>
                      <td>
                        <strong>{task.title}</strong>
                        {task.description && <p className="task-desc">{task.description}</p>}
                      </td>
                      <td>{task.assigned_to_name || 'Unassigned'}</td>
                      <td>{new Date(task.due_date).toLocaleDateString()}</td>
                      <td>
                        <span className={`priority-${task.priority?.toLowerCase()}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td>
                        <select
                          value={task.status}
                          onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Blocked">Blocked</option>
                        </select>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="btn btn-danger btn-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="resources-section card">
          <div className="section-header">
            <h2>Allocated Resources</h2>
          </div>
          {resources.length === 0 ? (
            <p className="no-data">No resources allocated to this project</p>
          ) : (
            <div className="resources-list">
              {resources.map(resource => (
                <div key={resource.id} className="resource-item">
                  <div>
                    <h3>{resource.name}</h3>
                    <p className="resource-type">{resource.type}</p>
                    {resource.quantity && (
                      <p className="resource-quantity">
                        Quantity: {resource.quantity} {resource.unit}
                      </p>
                    )}
                  </div>
                  <span className={getStatusClass(resource.status || 'Available')}>
                    {resource.status || 'Available'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showTaskModal && (
        <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Task</h2>
              <button className="close-btn" onClick={() => setShowTaskModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleTaskSubmit}>
              <div className="form-group">
                <label>Task Title *</label>
                <input
                  type="text"
                  value={taskFormData.title}
                  onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={taskFormData.description}
                  onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Due Date *</label>
                <input
                  type="date"
                  value={taskFormData.due_date}
                  onChange={(e) => setTaskFormData({ ...taskFormData, due_date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Assign To</label>
                <select
                  value={taskFormData.assigned_to}
                  onChange={(e) => setTaskFormData({ ...taskFormData, assigned_to: e.target.value })}
                >
                  <option value="">Unassigned</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.full_name || user.username}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Priority *</label>
                <select
                  value={taskFormData.priority}
                  onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value })}
                  required
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select
                  value={taskFormData.status}
                  onChange={(e) => setTaskFormData({ ...taskFormData, status: e.target.value })}
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Create Task
                </button>
                <button type="button" onClick={() => setShowTaskModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
