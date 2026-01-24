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

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await recipesAPI.deleteRecipe(id);
        setRecipes(recipes.filter(recipe => recipe._id !== id));
        setError('');
      } catch (err: any) {
        let errorMessage = 'Failed to delete recipe.';
        
        if (err.response?.status === 403) {
          errorMessage = 'You do not have permission to delete this recipe. You can only delete recipes you created.';
        } else if (err.response?.status === 404) {
          errorMessage = 'Recipe not found.';
        } else if (err.response?.status === 401) {
          errorMessage = 'You must be logged in to delete recipes.';
        } else if (err.response?.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
        alert(errorMessage);
        console.error('Delete error:', err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading recipes...</div>;
  }

  return (
    <div className="recipes-container">
      <div className="recipes-header">
        <h1>All Recipes</h1>
        <Link to="/add-recipe" className="add-recipe-btn">
          + Add New Recipe
        </Link>
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
              {recipe.imageCover && (
                <div className="recipe-thumbnail">
                  <img src={recipe.imageCover} alt={recipe.title} />
                </div>
              )}
              <div className="recipe-content">
                <h2>{recipe.title}</h2>
                {recipe.user && typeof recipe.user === 'object' && (
                  <p className="recipe-author">By: {recipe.user.email}</p>
                )}
                {recipe.description && <p className="recipe-description">{recipe.description}</p>}
                
                <div className="recipe-info">
                  <p><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</p>
                  <p><strong>Steps:</strong> {recipe.steps.join(', ')}</p>
                  {recipe.cookingTime && (
                    <p><strong>Cook Time:</strong> {recipe.cookingTime} minutes</p>
                  )}
                </div>
              </div>
              
              <div className="recipe-actions">
                <Link to={`/recipes/${recipe._id}`} className="view-btn">
                  View Details
                </Link>
                {recipe.user && typeof recipe.user === 'object' && recipe.user._id === currentUserId && (
                  <>
                    <Link to={`/edit-recipe/${recipe._id}`} className="edit-btn">
                      Edit
                    </Link>
                    <button
                      onClick={() => recipe._id && handleDelete(recipe._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;
