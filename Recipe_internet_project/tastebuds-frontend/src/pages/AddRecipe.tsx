import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipesAPI } from '../services/api';
import './RecipeForm.css';

interface FormData {
  title: string;
  description: string;
  ingredients: string;
  steps: string;
  cookingTime: string;
  imageCover: string;
}

const AddRecipe: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    ingredients: '',
    steps: '',
    cookingTime: '',
    imageCover: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const dataToSend = {
        title: formData.title,
        description: formData.description,
        ingredients: formData.ingredients.split('\n').filter(item => item.trim()),
        steps: formData.steps.split('\n').filter(item => item.trim()),
        cookingTime: formData.cookingTime ? parseInt(formData.cookingTime) : undefined,
        imageCover: formData.imageCover,
      };
      
      await recipesAPI.createRecipe(dataToSend);
      navigate('/recipes');
    } catch (err: any) {
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
            errorMessage = errors.map((e: string) => `• ${e}`).join('\n');
          } else if (typeof errors === 'object') {
            errorMessage = Object.values(errors).map((e: any) => `• ${e}`).join('\n');
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Recipe Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter recipe title"
              maxLength={40}
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageCover">Image URL *</label>
            <input
              type="url"
              id="imageCover"
              name="imageCover"
              value={formData.imageCover}
              onChange={handleChange}
              required
              placeholder="Enter image URL"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter recipe description"
              rows={3}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="ingredients">Ingredients * (one per line)</label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              required
              placeholder="Enter ingredients (one per line)"
              rows={4}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="steps">Cooking Steps * (one per line)</label>
            <textarea
              id="steps"
              name="steps"
              value={formData.steps}
              onChange={handleChange}
              required
              placeholder="Enter cooking steps (one per line)"
              rows={5}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="cookingTime">Cooking Time (minutes) *</label>
            <input
              type="number"
              id="cookingTime"
              name="cookingTime"
              value={formData.cookingTime}
              onChange={handleChange}
              required
              placeholder="Enter cooking time in minutes"
              min={1}
            />
          </div>

          {error && (
            <div className="error-message">
              {error.split('\n').map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          )}

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
