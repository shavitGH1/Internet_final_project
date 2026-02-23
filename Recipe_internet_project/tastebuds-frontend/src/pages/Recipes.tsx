import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recipesAPI, Recipe } from '../services/api';
import { getCurrentUserId } from '../utils/auth';
import './Recipes.css';

const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  // הסטייטים החדשים לחיפוש וסינון
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await recipesAPI.getAllRecipes();
      setRecipes(response.data);
      setError('');
    } catch (err: any) {
      setError('Failed to load recipes. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (e: React.MouseEvent, recipeId: string) => {
    e.preventDefault(); 
    try {
      const response = await recipesAPI.toggleFavorite(recipeId);
      setRecipes(prevRecipes => 
        prevRecipes.map(r => 
          r._id === recipeId ? { ...r, favorites: response.data.favorites } : r
        )
      );
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    }
  };

  // הלוגיקה שמסננת את המתכונים גם לפי טקסט וגם לפי מועדפים
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
    const favoritesList = (recipe.favorites || []) as any[];
    const isLiked = favoritesList.includes(currentUserId);
    
    if (showFavorites && !isLiked) return false;
    if (!matchesSearch) return false;
    
    return true;
  });

  if (loading) {
    return <div className="loading">Loading recipes...</div>;
  }

  return (
    <div className="recipes-container">
      <div className="recipes-header">
        <h1>All Recipes</h1>
      </div>

      {/* --- אזור השליטה החדש: חיפוש ופילטר --- */}
      <div className="recipes-controls">
        <div className="search-wrapper">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 Search recipes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          className={`filter-btn ${showFavorites ? 'active' : ''}`}
          onClick={() => setShowFavorites(!showFavorites)}
        >
          {showFavorites ? '❤️ Favorites Only' : '🤍 Show Favorites'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {recipes.length === 0 ? (
        <div className="no-recipes">
          <p>No recipes found. Start by adding your first recipe!</p>
          <Link to="/add-recipe" className="add-recipe-btn">
            Add Recipe
          </Link>
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="no-recipes">
          <p>No recipes match your search criteria. 🤷‍♂️</p>
        </div>
      ) : (
        <div className="recipes-grid">
          {filteredRecipes.map((recipe) => {
            const favoritesList = (recipe.favorites || []) as any[];
            const isLiked = favoritesList.includes(currentUserId);

            return (
              <div key={recipe._id} className="recipe-card" style={{ position: 'relative' }}>
                <div 
                  className="like-icon-container"
                  onClick={(e) => handleLike(e, recipe._id!)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: 2,
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '50%',
                    width: '35px',
                    height: '35px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <i 
                    className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}`} 
                    style={{ color: isLiked ? '#ff4d4d' : '#666', fontSize: '1.2rem' }}
                  ></i>
                </div>

                <Link to={`/recipes/${recipe._id}`} className="recipe-card-link">
                  {recipe.imageCover ? (
                    <div className="recipe-thumbnail">
                      <img src={recipe.imageCover} alt={recipe.title} />
                    </div>
                  ) : (
                    <div className="recipe-thumbnail placeholder">
                      <span>No image</span>
                    </div>
                  )}

                  <div className="recipe-content">
                    <h2 className="recipe-title">{recipe.title}</h2>
                    <p className="recipe-author">
                      {recipe.user && typeof recipe.user === 'object' ? (recipe.user as any).username || (recipe.user as any).email : 'Unknown'}
                    </p>
                    
                    <div className="recipe-card-stats">
                      <span className="stat-item">
                        ❤️ {recipe.favorites?.length || 0}
                      </span>
                      <span className="stat-item">
                        💬 {recipe.commentCount || 0}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Recipes;