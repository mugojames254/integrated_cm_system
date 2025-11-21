import React, { useState, useEffect } from 'react';
import { resourcesAPI, projectsAPI } from '../services/api';
import './Resources.css';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Material',
    quantity: '',
    unit: '',
    status: 'Available',
    project_id: '',
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      const filters = filter !== 'all' ? { type: filter } : {};
      const [resourcesRes, projectsRes] = await Promise.all([
        resourcesAPI.getAll(filters),
        projectsAPI.getAll()
      ]);
      setResources(resourcesRes.data);
      setProjects(projectsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resourcesAPI.create(formData);
      setShowModal(false);
      setFormData({
        name: '',
        type: 'Material',
        quantity: '',
        unit: '',
        status: 'Available',
        project_id: '',
        description: ''
      });
      fetchData();
    } catch (error) {
      alert('Failed to create resource');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await resourcesAPI.delete(id);
        fetchData();
      } catch (error) {
        alert('Failed to delete resource');
      }
    }
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status.toLowerCase().replace(' ', '-')}`;
  };

  if (loading) {
    return <div className="loading">Loading resources...</div>;
  }

  return (
    <div className="resources-page">
      <div className="page-header">
        <h1>Resources Management</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          + Add Resource
        </button>
      </div>

      <div className="filter-tabs">
        <button
          className={filter === 'all' ? 'tab active' : 'tab'}
          onClick={() => setFilter('all')}
        >
          All Resources
        </button>
        <button
          className={filter === 'Material' ? 'tab active' : 'tab'}
          onClick={() => setFilter('Material')}
        >
          Materials
        </button>
        <button
          className={filter === 'Machinery' ? 'tab active' : 'tab'}
          onClick={() => setFilter('Machinery')}
        >
          Machinery
        </button>
      </div>

      <div className="resources-table card">
        {resources.length === 0 ? (
          <p className="no-data">No resources found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Project</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map(resource => (
                <tr key={resource.id}>
                  <td><strong>{resource.name}</strong></td>
                  <td>{resource.type}</td>
                  <td>
                    {resource.quantity 
                      ? `${resource.quantity} ${resource.unit || ''}` 
                      : '-'}
                  </td>
                  <td>
                    <span className={getStatusClass(resource.status || 'Available')}>
                      {resource.status || 'Available'}
                    </span>
                  </td>
                  <td>{resource.project_name || 'Unassigned'}</td>
                  <td>{resource.description || '-'}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(resource.id)}
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

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Resource</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Resource Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="Material">Material</option>
                  <option value="Machinery">Machinery</option>
                </select>
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Unit</label>
                <input
                  type="text"
                  placeholder="e.g., kg, tons, units"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  <option value="Available">Available</option>
                  <option value="In Use">In Use</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
              <div className="form-group">
                <label>Assign to Project</label>
                <select
                  value={formData.project_id}
                  onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                >
                  <option value="">Unassigned</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Create Resource
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

export default Resources;
