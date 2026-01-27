import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>Smart Appointment Manager</h1>
        </div>
        <ul className="navbar-menu">
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/staff">Staff</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/appointments">Appointments</Link></li>
          <li><Link to="/queue">Queue</Link></li>
        </ul>
        <div className="navbar-user">
          <span className="user-email">{user?.email}</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
