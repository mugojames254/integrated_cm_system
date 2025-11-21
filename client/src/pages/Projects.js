import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'Planning'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await projectsAPI.create(formData);
      setShowModal(false);
      setFormData({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        status: 'Planning'
      });
      fetchProjects();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create project');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsAPI.delete(id);
        fetchProjects();
      } catch (error) {
        alert('Failed to delete project');
      }
    }
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status.toLowerCase().replace(' ', '-')}`;
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div className="projects-page">
      <div className="page-header">
        <h1>Projects</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          + Add Project
        </button>
      </div>

      <div className="projects-grid">
        {projects.length === 0 ? (
          <div className="no-data">No projects found. Create your first project!</div>
        ) : (
          projects.map(project => (
            <div key={project.id} className="project-card card">
              <div className="project-card-header">
                <h2>{project.name}</h2>
                <span className={getStatusClass(project.status)}>{project.status}</span>
              </div>
              <p className="project-description">{project.description || 'No description'}</p>
              <div className="project-dates">
                <div>
                  <strong>Start:</strong> {new Date(project.start_date).toLocaleDateString()}
                </div>
                <div>
                  <strong>End:</strong> {new Date(project.end_date).toLocaleDateString()}
                </div>
              </div>
              <div className="project-card-footer">
                <Link to={`/projects/${project.id}`} className="btn btn-secondary">
                  View Details
                </Link>
                <button onClick={() => handleDelete(project.id)} className="btn btn-danger">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Project</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Project Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date *</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Create Project
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
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

export default Projects;
