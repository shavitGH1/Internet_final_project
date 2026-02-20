import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { recipesAPI } from '../services/api';
import './RecipeForm.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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
  const location = useLocation();
  const [url, setUrl] = useState<string>('');

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
      let errorMessage = 'Failed to add recipe. Please try again.';
      
      if (err.response?.data) {
        if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
          if (errorMessage.includes('validation failed:')) {
            const validationPart = errorMessage.split('validation failed:')[1];
            if (validationPart) {
              errorMessage = validationPart;
            }
          }
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        }
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

  const handleUrlSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await recipesAPI.addRecipeFromUrl({ url });
      navigate('/recipes');
    } catch (err: any) {
      setError('Failed to add recipe from URL. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isManual = location.pathname.includes('/manual');
  const isUrl = location.pathname.includes('/url');

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <h1>Add New Recipe</h1>
        {isManual && (
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
                className="form-control"
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
                className="form-control"
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
                className="form-control"
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
                className="form-control"
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
                className="form-control"
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
                className="form-control"
              />
            </div>
            {error && (
              <div className="error-message">
                {error.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            )}
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add Recipe'}
              </button>
            </div>
          </form>
        )}
        {isUrl && (
          <form onSubmit={handleUrlSubmit}>
            <div className="form-group">
              <label htmlFor="url">Recipe URL *</label>
              <input
                type="url"
                id="url"
                name="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-success">
              {loading ? 'Adding...' : 'Add Recipe via URL'}
            </button>
          </form>
        )}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default AddRecipe;
