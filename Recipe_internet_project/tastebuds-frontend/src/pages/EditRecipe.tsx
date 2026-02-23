import React, { useState, useEffect, FormEvent, ChangeEvent, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { recipesAPI, fileAPI } from '../services/api'; // הוספנו את fileAPI
import './RecipeForm.css';

interface FormData {
  title: string;
  description: string;
  ingredients: string;
  steps: string;
  cookingTime: string;
  imageCover: string;
}

const EditRecipe: React.FC = () => {
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
  const [loadingRecipe, setLoadingRecipe] = useState<boolean>(true);
  
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      fetchRecipe(id);
    }
  }, [id]);

  const fetchRecipe = async (recipeId: string) => {
    try {
      setLoadingRecipe(true);
      const response = await recipesAPI.getRecipeById(recipeId);
      const recipe = response.data;
      
      setFormData({
        title: recipe.title,
        description: recipe.description || '',
        ingredients: recipe.ingredients.join('\n'),
        steps: recipe.steps.join('\n'),
        cookingTime: recipe.cookingTime ? recipe.cookingTime.toString() : '',
        imageCover: recipe.imageCover,
      });
      setImagePreview(recipe.imageCover);
      setError('');
    } catch (err: any) {
      setError('Failed to load recipe. Please try again.');
      console.error(err);
    } finally {
      setLoadingRecipe(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === 'imageCover') {
      setImagePreview(value);
    }
  };

  // --- הפונקציה המעודכנת ששולחת את התמונה לשרת ---
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // מציג תצוגה מקדימה מידית למשתמש
    const localPreviewUrl = URL.createObjectURL(file);
    setImagePreview(localPreviewUrl);

    try {
      // שולח את הקובץ לשרת ומקבל את הלינק
      const response = await fileAPI.uploadImage(file);
      setFormData(prev => ({ ...prev, imageCover: response.url }));
    } catch (err) {
      console.error("Failed to upload image", err);
      setError("Failed to upload image to server.");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!id) {
        throw new Error('Recipe ID is missing');
      }

      const dataToSend = {
        title: formData.title,
        ingredients: formData.ingredients.split('\n').filter(item => item.trim()),
        steps: formData.steps.split('\n').filter(item => item.trim()),
        cookingTime: formData.cookingTime ? parseInt(formData.cookingTime) : undefined,
        imageCover: formData.imageCover,
        description: formData.description,
      };
      
      await recipesAPI.updateRecipe(id, dataToSend);
      navigate('/recipes');
    } catch (err: any) {
      let errorMessage = 'Failed to update recipe. Please try again.';
      if (err.response?.data) {
        if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
          if (errorMessage.includes('validation failed:')) {
            const validationPart = errorMessage.split('validation failed:')[1];
            if (validationPart) {
              const errors = validationPart.split(',').map(err => {
                const parts = err.trim().split(':');
                if (parts.length >= 2) {
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

  if (loadingRecipe) {
    return <div className="loading">Loading recipe...</div>;
  }

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <h1>Edit Recipe</h1>

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

          <div className="form-group image-upload-group">
            <label>Recipe Image *</label>
            
            <div className="image-preview-container">
              {imagePreview ? (
                <img src={imagePreview} alt="Recipe Preview" className="recipe-image-preview" />
              ) : (
                <div className="no-image-placeholder">No Image Available</div>
              )}
              
              <button
                type="button"
                className="camera-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Upload new image"
              >
                📷
              </button>
              
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            
            <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '8px', marginBottom: '4px' }}>
              Or paste an image URL directly:
            </p>
            <input
              type="url"
              id="imageCover"
              name="imageCover"
              value={formData.imageCover}
              onChange={handleChange}
              placeholder="https://..."
              className="form-control url-fallback-input"
              required={!imagePreview}
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
              {loading ? 'Updating Recipe...' : 'Update Recipe'}
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

export default EditRecipe;