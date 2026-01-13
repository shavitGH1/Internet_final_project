import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipesAPI } from '../services/api';
import './RecipeForm.css';

const AddRecipe = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ingredients: '',
    instructions: '',
    cookTime: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        cookTime: formData.cookTime ? parseInt(formData.cookTime) : undefined,
      };
      
      await recipesAPI.createRecipe(dataToSend);
      navigate('/recipes');
    } catch (err) {
      // Extract meaningful error messages from the API response
      let errorMessage = 'Failed to add recipe. Please try again.';
      
      if (err.response?.data) {
        // Check for various error formats
        if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
          
          // Parse validation errors like "Recipe validation failed: field1: error1, field2: error2"
          if (errorMessage.includes('validation failed:')) {
            const validationPart = errorMessage.split('validation failed:')[1];
            if (validationPart) {
              // Split by comma and format each error
              const errors = validationPart.split(',').map(err => {
                const parts = err.trim().split(':');
                if (parts.length >= 2) {
                  const field = parts[0].trim();
                  const message = parts.slice(1).join(':').trim();
                  return `• ${message}`;
                }
                return `• ${err.trim()}`;
              });
              errorMessage = errors.join('\n');
            }
          }
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        }
        
        // If there are validation errors, format them nicely
        if (err.response.data.errors) {
          const errors = err.response.data.errors;
          if (Array.isArray(errors)) {
            errorMessage = errors.map(e => `• ${e}`).join('\n');
          } else if (typeof errors === 'object') {
            errorMessage = Object.values(errors).map(e => `• ${e}`).join('\n');
          }
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error('Error details:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <h1>Add New Recipe</h1>
        {error && (
          <div className="error-message">
            {error.split('\n').map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Recipe Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter recipe name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter recipe description"
              rows="3"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="ingredients">Ingredients *</label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              required
              placeholder="Enter ingredients (one per line or comma-separated)"
              rows="4"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="instructions">Instructions *</label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              required
              placeholder="Enter cooking instructions"
              rows="5"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="cookTime">Cook Time (minutes)</label>
            <input
              type="number"
              id="cookTime"
              name="cookTime"
              value={formData.cookTime}
              onChange={handleChange}
              placeholder="Enter cooking time in minutes"
              min="0"
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Adding Recipe...' : 'Add Recipe'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/recipes')}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecipe;
