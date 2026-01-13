import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, clearTokens } from '../utils/auth';
import './Navigation.css';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  const handleLogout = () => {
    clearTokens();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🍽️ TasteBuds
        </Link>

        <div className="nav-menu">
          {authenticated ? (
            <>
              <Link to="/recipes" className="nav-link">
                Recipes
              </Link>
              <Link to="/add-recipe" className="nav-link">
                Add Recipe
              </Link>
              <button onClick={handleLogout} className="nav-link logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
