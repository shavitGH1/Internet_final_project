import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recipesAPI, Recipe } from '../services/api';
import './Recipes.css';

const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

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
      } catch (err: any) {
        setError('Failed to delete recipe. Please try again.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading recipes...</div>;
  }

  return (
    <div className="recipes-container">
      <div className="recipes-header">
        <h1>TasteBuds Recipes</h1>
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
              <div className="recipe-content">
                <h2>{recipe.title}</h2>
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
                <Link to={`/edit-recipe/${recipe._id}`} className="edit-btn">
                  Edit
                </Link>
                <button
                  onClick={() => recipe._id && handleDelete(recipe._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;
