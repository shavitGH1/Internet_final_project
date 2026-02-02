import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipesAPI, Recipe } from '../services/api';
import { getCurrentUserId } from '../utils/auth';
import './RecipeDetail.css';

const RecipeDetail: React.FC = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    if (id) {
      fetchRecipe(id);
    }
  }, [id]);

  const fetchRecipe = async (recipeId: string) => {
    try {
      setLoading(true);
      const response = await recipesAPI.getRecipeById(recipeId);
      setRecipe(response.data);
      setError('');
    } catch (err: any) {
      setError('Failed to load recipe. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading recipe...</div>;
  }

  if (error || !recipe) {
    return (
      <div className="error-container">
        <div className="error-message">{error || 'Recipe not found'}</div>
        <button onClick={() => navigate('/recipes')} className="back-btn">
          Back to Recipes
        </button>
      </div>
    );
  }

  return (
    <div className="recipe-detail-container">
      <div className="recipe-detail-wrapper">
        <button onClick={() => navigate('/recipes')} className="back-btn">
          ← Back to Recipes
        </button>

        <div className="recipe-detail-header">
          <h1>{recipe.title}</h1>
          {recipe.cookingTime && (
            <div className="cooking-time-badge">
              <span>⏱️ {recipe.cookingTime} minutes</span>
            </div>
          )}
        </div>

        {recipe.imageCover && (
          <div className="recipe-image-container">
            <img src={recipe.imageCover} alt={recipe.title} className="recipe-image" />
          </div>
        )}

        {recipe.description && (
          <div className="recipe-section">
            <h2>Description</h2>
            <p className="recipe-description-text">{recipe.description}</p>
          </div>
        )}

        <div className="recipe-section">
          <h2>Ingredients</h2>
          <ul className="ingredients-list">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                <span className="ingredient-bullet">✓</span>
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        <div className="recipe-section">
          <h2>Cooking Steps</h2>
          <ol className="steps-list">
            {recipe.steps.map((step, index) => (
              <li key={index}>
                <span className="step-number">{index + 1}</span>
                <span className="step-text">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="recipe-actions">
          {(() => {
            const ownerId = recipe.user && typeof recipe.user === 'object' ? (recipe.user as any)._id : recipe.user;
            const canEdit = !!currentUserId && !!ownerId && String(ownerId) === String(currentUserId);
            return canEdit ? (
              <button
                onClick={() => navigate(`/edit-recipe/${recipe._id}`)}
                className="edit-recipe-btn"
              >
                Edit Recipe
              </button>
            ) : null;
          })()}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
