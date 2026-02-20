import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recipesAPI, Recipe } from '../services/api';
import { getCurrentUserId } from '../utils/auth';
import './Recipes.css';

const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
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

  if (loading) {
    return <div className="loading">Loading recipes...</div>;
  }

  return (
    <div className="recipes-container">
      <div className="recipes-header">
        <h1>All Recipes</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      {recipes.length === 0 ? (
        <div className="no-recipes">
          <p>No recipes found. Start by adding your first recipe!</p>
          <Link to="/add-recipe" className="add-recipe-btn">
            Add Recipe
          </Link>
        </div>
      ) : (
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="recipe-card">
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
                  {(() => {
                    const author = recipe.user && typeof recipe.user === 'object' ? (recipe.user as any).email : (recipe.user || 'Unknown');
                    return <p className="recipe-author">{author}</p>;
                  })()}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;
