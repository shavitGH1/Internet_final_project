import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, clearTokens, getUserEmail } from '../utils/auth';
import './Navigation.css';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const userEmail = getUserEmail();

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
                All Recipes
              </Link>
              <Link to="/my-recipes" className="nav-link">
                My Recipes
              </Link>
              <Link to="/add-recipe" className="nav-link">
                Add Recipe
              </Link>
              <span className="nav-greeting">
                Hello, {userEmail}!
              </span>
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
