import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import Button from './Button';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      navigate('/login', { replace: true });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/">User Management</Link>
        </div>
        <div className="navbar-menu">
          {user && (
            <>
              <div className="navbar-user-info">
                <span className="navbar-user-name">{user.fullName}</span>
                <span className={`navbar-user-role role-${user.role}`}>
                  {user.role}
                </span>
              </div>
              {user.role === 'admin' && (
                <Link to="/dashboard" className="navbar-link">
                  Dashboard
                </Link>
              )}
              <Link to="/tasks" className="navbar-link">
                Tasks
              </Link>
              <Link to="/profile" className="navbar-link">
                Profile
              </Link>
              <Button variant="outline" size="small" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

