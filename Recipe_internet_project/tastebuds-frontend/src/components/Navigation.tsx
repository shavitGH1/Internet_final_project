import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
        <NavLink to="/" className="nav-logo">
          🍽️ TasteBuds
        </NavLink>

        <div className="nav-menu">
          {authenticated ? (
            <>
              <NavLink to="/recipes" className="nav-link">
                All Recipes
              </NavLink>
              <NavLink to="/my-recipes" className="nav-link">
                My Recipes
              </NavLink>
              <NavLink to="/add-recipe" className="nav-link">
                Add Recipe
              </NavLink>
              <span className="nav-greeting">
                Hello, {userEmail}!
              </span>
              <button onClick={handleLogout} className="nav-link logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>
              <NavLink to="/register" className="nav-link">
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
