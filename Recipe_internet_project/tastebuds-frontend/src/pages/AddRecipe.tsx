import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { recipesAPI } from '../services/api';
import './RecipeForm.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchRecipeFromGemini } from '../services/geminiService';

interface FormData {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  cookingTime: string;
  imageCover: string;
}

const AddRecipe: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    ingredients: [''],
    steps: [''],
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

  const handleArrayChange = (index: number, value: string, field: 'ingredients' | 'steps') => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayField = (field: 'ingredients' | 'steps') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (index: number, field: 'ingredients' | 'steps') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement> | null) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const dataToSend = {
        title: formData.title,
        description: formData.description,
        ingredients: formData.ingredients.filter(item => item.trim() !== ''),
        steps: formData.steps.filter(item => item.trim() !== ''),
        cookingTime: formData.cookingTime ? parseInt(formData.cookingTime) : undefined,
        imageCover: formData.imageCover,
      };
      await recipesAPI.createRecipe(dataToSend);
      navigate('/recipes');
    } catch (err: any) {
      setError(err.message || 'Failed to add recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const extractionPrompt = `
        Extract the recipe from this URL: ${url}.
        You MUST reply in plain text using EXACTLY these headings. Do not add any conversational text.
        If you can't find the exact title, leave it blank under the heading.

        ### TITLE ###
        [Insert Recipe Name Here]

        ### INGREDIENTS ###
        [Insert each ingredient on a new line starting with a dash "-"]

        ### INSTRUCTIONS ###
        [Insert each step on a new line starting with a number "1. "]

        ### COOK TIME ###
        [Insert time in minutes, e.g., 15]
      `;

      const rawText: any = await fetchRecipeFromGemini(extractionPrompt);
      
      if (typeof rawText !== 'string') {
        throw new Error('Expected text from AI, but got something else.');
      }

      console.log("Parsing text from AI...");

      const extractSection = (text: string, startMarker: string, endMarker: string) => {
        const startIndex = text.indexOf(startMarker);
        if (startIndex === -1) return '';
        const startPos = startIndex + startMarker.length;
        const endIndex = endMarker ? text.indexOf(endMarker, startPos) : text.length;
        return endIndex !== -1 ? text.substring(startPos, endIndex).trim() : text.substring(startPos).trim();
      };

      let extractedTitle = extractSection(rawText, '### TITLE ###', '### INGREDIENTS ###');
      const rawIngredients = extractSection(rawText, '### INGREDIENTS ###', '### INSTRUCTIONS ###');
      const rawInstructions = extractSection(rawText, '### INSTRUCTIONS ###', '### COOK TIME ###');
      const extractedCookTime = extractSection(rawText, '### COOK TIME ###', '');

      if (!extractedTitle || extractedTitle.includes('[Insert Recipe Name Here]') || extractedTitle.trim() === '') {
         const titlePrompt = `
           Based on the following recipe text, what is the exact name of the dish being prepared?
           Return ONLY the name of the dish, nothing else. Keep it very short and concise.
           Do not use quotes or punctuation.
           
           Recipe:
           ${rawText.substring(0, 800)} 
         `;
         const rawTitle = await fetchRecipeFromGemini(titlePrompt);
         extractedTitle = (rawTitle || "").replace(/[*"']/g, '').trim();
      }

      const ingredientsList = rawIngredients
        .split('\n')
        .map(i => i.replace(/^[-*•]\s*/, '').trim())
        .filter(i => i !== '');

      const instructionsList = rawInstructions
        .split('\n')
        .map(i => i.replace(/^\d+\.\s*/, '').trim())
        .filter(i => i !== '');

      if (ingredientsList.length === 0 || instructionsList.length === 0) {
        throw new Error("We couldn't find a valid recipe at this URL. Please check the link or add it manually.");
      }

      const cookingTimeInt = extractedCookTime ? parseInt(extractedCookTime.replace(/\D/g, '')) : undefined;

      const dataToSend = {
        title: extractedTitle,
        description: `Recipe imported automatically from: ${url}`,
        ingredients: ingredientsList,
        steps: instructionsList,
        cookingTime: cookingTimeInt || 0, 
        imageCover: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      };

      // הקסם שקורה פה: אנחנו שומרים את התגובה של השרת, שולפים ממנה את ה-ID החדש ומנווטים אליו!
      const response = await recipesAPI.createRecipe(dataToSend);
      if (response.data && response.data._id) {
        navigate(`/recipes/${response.data._id}`);
      } else {
        // במידה והשרת משום מה לא החזיר ID, נחזור לדף הראשי כגיבוי
        navigate('/recipes');
      }

    } catch (err: any) {
      console.error("Error in handleUrlSubmit:", err);
      setError(err.message || 'Failed to extract and save recipe from the URL. Please try entering it manually.');
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
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className="form-control" maxLength={40} />
            </div>
            
            <div className="form-group">
              <label htmlFor="imageCover">Image URL *</label>
              <input type="url" id="imageCover" name="imageCover" value={formData.imageCover} onChange={handleChange} required className="form-control" />
            </div>

            <div className="form-group">
              <label>Ingredients *</label>
              {formData.ingredients.map((ing, index) => (
                <div key={`ing-${index}`} className="dynamic-input-wrapper">
                  <input
                    type="text"
                    value={ing}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'ingredients')}
                    className="form-control"
                    placeholder={`Ingredient ${index + 1}`}
                    required={index === 0}
                  />
                  {formData.ingredients.length > 1 && (
                    <button type="button" className="remove-btn" onClick={() => removeArrayField(index, 'ingredients')} aria-label="Remove">
                      &times;
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="add-btn" onClick={() => addArrayField('ingredients')}>
                + Add Ingredient
              </button>
            </div>

            <div className="form-group">
              <label>Cooking Steps *</label>
              {formData.steps.map((step, index) => (
                <div key={`step-${index}`} className="dynamic-input-wrapper">
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'steps')}
                    className="form-control"
                    placeholder={`Step ${index + 1}`}
                    required={index === 0}
                  />
                  {formData.steps.length > 1 && (
                    <button type="button" className="remove-btn" onClick={() => removeArrayField(index, 'steps')} aria-label="Remove">
                      &times;
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="add-btn" onClick={() => addArrayField('steps')}>
                + Add Step
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="cookingTime">Cooking Time (minutes) *</label>
              <input type="number" id="cookingTime" name="cookingTime" value={formData.cookingTime} onChange={handleChange} required min={1} className="form-control" />
            </div>
            
            <div className="form-actions">
              <button id="submitmanual" type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Adding...' : 'Add Recipe'}
              </button>
            </div>
          </form>
        )}

        {/* האזור של חיפוש ה-URL שכולל את האנימציה! */}
        {isUrl && (
          loading ? (
            <div className="ai-loader-container">
              <div className="ai-spinner"></div>
              <p className="ai-loader-text">Fetching your recipe, this might take a few seconds... 🪄</p>
            </div>
          ) : (
            <form onSubmit={handleUrlSubmit}>
              <div className="form-group">
                <label htmlFor="url">Recipe URL *</label>
                <input type="url" id="url" value={url} onChange={(e) => setUrl(e.target.value)} required className="form-control" placeholder="https://example.com/recipe" />
              </div>
              <button id="submiturl" type="submit" disabled={loading} className="submit-btn">
                Add Recipe via URL
              </button>
            </form>
          )
        )}

        {error && <div className="error-message mt-3 text-danger">{error}</div>}
      </div>
    </div>
  );
};

export default AddRecipe;