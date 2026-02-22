import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recipesAPI, Recipe } from '../services/api';
import { getCurrentUserId } from '../utils/auth';
import './Recipes.css';

const MyRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const fetchMyRecipes = async () => {
    try {
      setLoading(true);
      const response = await recipesAPI.getAllRecipes();
      // סינון המתכונים של המשתמש הנוכחי
      const myRecipes = response.data.filter(recipe => 
        recipe.user && typeof recipe.user === 'object' && (recipe.user as any)._id === currentUserId
      );
      setRecipes(myRecipes);
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

  if (loading) {
    return <div className="loading">Loading your recipes...</div>;
  }

  return (
    <div className="recipes-container">
      <div className="recipes-header">
        <h1>My Recipes</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      {recipes.length === 0 ? (
        <div className="no-recipes">
          <p>You haven't created any recipes yet. Start by adding your first recipe!</p>
        </div>
      ) : (
        <div className="recipes-grid">
          {recipes.map((recipe) => {
            // פתרון שגיאה 1: המרה ל-any כדי לעקוף את בעיית הטיפוס ב-includes
            const favoritesList = (recipe.favorites || []) as any[];
            const isLiked = favoritesList.includes(currentUserId);

            return (
              <div key={recipe._id} className="recipe-card" style={{ position: 'relative' }}>
                <div 
                  className="like-icon-container"
                  // פתרון שגיאה 2: שימוש ב-! כדי להבטיח ל-TS שה-ID קיים
                  onClick={(e) => handleLike(e, recipe._id!)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: 2,
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '50%',
                    width: '35px',
                    height: '35px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p className="recipe-author">
                        {recipe.user && typeof recipe.user === 'object' ? (recipe.user as any).username : 'Me'}
                      </p>
                      <span className="likes-count" style={{ fontSize: '0.9rem', color: '#888' }}>
                        {recipe.favorites?.length || 0} ❤️
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

export default MyRecipes;