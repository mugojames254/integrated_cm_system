import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI, tasksAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalTasks: 0,
    myTasks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        projectsAPI.getAll(),
        tasksAPI.getAll()
      ]);

      const projectsData = projectsRes.data;
      const tasksData = tasksRes.data;

      setProjects(projectsData.slice(0, 5));
      
      // Filter tasks for current user if employee
      const userTasks = user?.role === 'Employee' 
        ? tasksData.filter(task => task.assigned_to === user.id)
        : tasksData;
      
      setTasks(userTasks.slice(0, 5));

      setStats({
        totalProjects: projectsData.length,
        activeProjects: projectsData.filter(p => p.status === 'In Progress').length,
        totalTasks: tasksData.length,
        myTasks: user?.role === 'Employee' 
          ? tasksData.filter(t => t.assigned_to === user.id && t.status !== 'Completed').length
          : tasksData.filter(t => t.status !== 'Completed').length
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status.toLowerCase().replace(' ', '-')}`;
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header-with-logo">
        <img src="/company_logo.png" alt="Hiroto & James Consultant" className="dashboard-logo" />
        <div className="dashboard-header-text">
          <h1>Dashboard</h1>
          <p className="welcome-message">Welcome back, {user?.full_name || user?.username}!</p>
        </div>
      </div>

      <div className="stats-grid grid grid-4">
        <div className="stats-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <h3>Total Projects</h3>
          <div className="stats-value">{stats.totalProjects}</div>
        </div>
        <div className="stats-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
          <h3>Active Projects</h3>
          <div className="stats-value">{stats.activeProjects}</div>
        </div>
        <div className="stats-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
          <h3>Total Tasks</h3>
          <div className="stats-value">{stats.totalTasks}</div>
        </div>
        <div className="stats-card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
          <h3>{user?.role === 'Admin' ? 'Pending Tasks' : 'My Tasks'}</h3>
          <div className="stats-value">{stats.myTasks}</div>
        </div>
      </div>

      <div className="dashboard-content grid grid-2">
        <div className="card">
          <div className="card-header">
            <h2>Recent Projects</h2>
            <Link to="/projects" className="btn btn-primary">View All</Link>
          </div>
          <div className="projects-list">
            {projects.length === 0 ? (
              <p className="no-data">No projects found</p>
            ) : (
              projects.map(project => (
                <Link key={project.id} to={`/projects/${project.id}`} className="project-item">
                  <div>
                    <h3>{project.name}</h3>
                    <p className="project-dates">
                      {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={getStatusClass(project.status)}>{project.status}</span>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>{user?.role === 'Admin' ? 'Recent Tasks' : 'My Tasks'}</h2>
            <Link to="/projects" className="btn btn-primary">View All</Link>
          </div>
          <div className="tasks-list">
            {tasks.length === 0 ? (
              <p className="no-data">No tasks found</p>
            ) : (
              tasks.map(task => (
                <div key={task.id} className="task-item">
                  <div>
                    <h3>{task.title}</h3>
                    <p className="task-project">{task.project_name}</p>
                    <p className="task-date">Due: {new Date(task.due_date).toLocaleDateString()}</p>
                  </div>
                  <div className="task-status">
                    <span className={getStatusClass(task.status)}>{task.status}</span>
                    <span className={`priority-${task.priority?.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
