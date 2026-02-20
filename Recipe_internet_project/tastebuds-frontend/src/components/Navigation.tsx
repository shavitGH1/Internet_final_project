import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { isAuthenticated, clearTokens, getUserEmail } from '../utils/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navigation.css';
const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const userEmail = getUserEmail();

  const [addRecipeDropdownOpen, setAddRecipeDropdownOpen] = useState(false);
  const addRecipeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addRecipeDropdownRef.current && !addRecipeDropdownRef.current.contains(event.target as Node)) {
        setAddRecipeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
              <div className="nav-item dropdown" ref={addRecipeDropdownRef}>
                <span className="nav-link dropdown-label">
                  + Add Recipe
                </span>
                <ul className="dropdown-menu">
                  <li>
                    <button className="dropdown-item" onClick={() => navigate('/add-recipe/manual')}>
                      Add Manually
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => navigate('/add-recipe/url')}>
                      Add via URL
                    </button>
                  </li>
                </ul>
              </div>
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
