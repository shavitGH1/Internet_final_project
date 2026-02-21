import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { isAuthenticated, clearTokens, getUserEmail } from '../utils/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navigation.css';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const userEmail = getUserEmail();
  
  // --- נתונים מה-LocalStorage ---
  const profilePic = localStorage.getItem('profilePic');
  const username = localStorage.getItem('userUsername');

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
                <span 
                  className="nav-link dropdown-label" 
                  onClick={() => setAddRecipeDropdownOpen(!addRecipeDropdownOpen)}
                >
                  + Add Recipe
                </span>
                <ul className={`dropdown-menu ${addRecipeDropdownOpen ? 'show' : ''}`}>
                  <li>
                    <button className="dropdown-item" onClick={() => { navigate('/add-recipe/manual'); setAddRecipeDropdownOpen(false); }}>
                      Add Manually
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => { navigate('/add-recipe/url'); setAddRecipeDropdownOpen(false); }}>
                      Add via URL
                    </button>
                  </li>
                </ul>
              </div>

              {/* פרופיל משתמש עם תיקון לתמונה שבורה */}
              <NavLink to="/profile" className="nav-profile-link">
                <img 
                  src={profilePic || '/avatar.png'} 
                  alt="Profile" 
                  className="nav-avatar"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; 
                    target.src = '/avatar.png';
                  }}
                />
                <span className="nav-greeting">
                   {username || userEmail?.split('@')[0]}
                </span>
              </NavLink>

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