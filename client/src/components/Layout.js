import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AIChatbox from './AIChatbox';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/dashboard">Hiroto & James Consultant</Link>
        </div>
        <div className="navbar-menu">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/resources">Resources</Link>
          {user?.role === 'Admin' && (
            <Link to="/employees">Employees</Link>
          )}
        </div>
        <div className="navbar-user">
          <span className="user-name">{user?.full_name || user?.username}</span>
          <span className="user-role">{user?.role}</span>
          <Link to="/profile" className="profile-link">Profile</Link>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
      <AIChatbox />
    </div>
  );
};

export default Layout;
