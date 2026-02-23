import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipesAPI, commentsAPI, Recipe } from '../services/api';
import { getCurrentUserId } from '../utils/auth';
import './RecipeDetail.css';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUserId = getCurrentUserId();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetchRecipeData(id);
    }
  }, [id]);

  const fetchRecipeData = async (recipeId: string) => {
    try {
      setLoading(true);
      const [recipeRes, commentsRes] = await Promise.all([
        recipesAPI.getRecipeById(recipeId),
        commentsAPI.getByRecipe(recipeId)
      ]);
      setRecipe(recipeRes.data);
      setComments(commentsRes.data);
      
      if (currentUserId && recipeRes.data.favorites) {
        const favs = recipeRes.data.favorites as any[];
        const hasLiked = favs.some(fav => fav === currentUserId || fav._id === currentUserId);
        setIsFavorite(hasLiked);
      }
    } catch (err: any) {
      setError('Failed to load data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!currentUserId) {
      alert("Please login to like this recipe.");
      return;
    }
    try {
      await recipesAPI.toggleFavorite(id!);
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !id) return;
    try {
      await commentsAPI.addComment({ recipe: id, comment: newComment });
      setNewComment('');
      const response = await commentsAPI.getByRecipe(id);
      setComments(response.data);
    } catch (err) {
      alert("Please login to post a comment.");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await commentsAPI.deleteComment(commentId);
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch (err) {
      alert("Failed to delete comment.");
    }
  };
  const handleDeleteRecipe = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe? This action cannot be undone.")) return;
    try {
      await recipesAPI.deleteRecipe(id!);
      navigate('/recipes'); 
    } catch (err) {
      alert("Failed to delete recipe.");
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error || !recipe) return <div className="error-container">{error || 'Recipe not found'}</div>;

  const ownerId = recipe.user && typeof recipe.user === 'object' ? (recipe.user as any)._id : recipe.user;
  const canEdit = !!currentUserId && String(ownerId) === String(currentUserId);

  return (
    <div className="recipe-detail-container">
      <div className="recipe-detail-wrapper">
        <button onClick={() => navigate('/recipes')} className="back-btn">← Back</button>
        <div className="recipe-detail-header">
          <h1>{recipe.title}</h1>
          <div className="header-badges">
            <button 
              onClick={handleToggleFavorite} 
              className={`detail-like-btn ${isFavorite ? 'liked' : ''}`}
            >
              {isFavorite ? '❤️ Liked' : '🤍 Like'}
            </button>
            {recipe.cookingTime && <span className="cooking-time-badge">⏱️ {recipe.cookingTime} min</span>}
          </div>
        </div>
        
        {recipe.imageCover && (
          <div className="recipe-image-container">
            <img src={recipe.imageCover} alt={recipe.title} className="recipe-image" />
          </div>
        )}
        
        <div className="recipe-section">
          <h2>Ingredients</h2>
          <ul className="ingredients-list">
            {recipe.ingredients.map((ing, i) => <li key={i}><span className="ingredient-bullet">✓</span>{ing}</li>)}
          </ul>
        </div>
        
        <div className="recipe-section">
          <h2>Steps</h2>
          <ol className="steps-list">
            {recipe.steps.map((step, i) => <li key={i}><span className="step-number">{i + 1}</span>{step}</li>)}
          </ol>
        </div>
        
        {canEdit && (
          <div className="recipe-actions">
            <button onClick={handleDeleteRecipe} className="delete-recipe-btn">Delete Recipe</button>
            <button onClick={() => navigate(`/edit-recipe/${recipe._id}`)} className="edit-recipe-btn">Edit Recipe</button>
          </div>
        )}
      </div>

      <div className="comments-card-container">
        <div className="comments-header">
          <h2>Comments <span className="comment-count-badge">{comments.length}</span></h2>
        </div>
        
        <div className="comment-input-wrapper">
          <input 
            type="text" 
            placeholder="What do you think about this recipe?" 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
          />
          <button onClick={handleAddComment} className="send-comment-btn" title="Send">
            ➤
          </button>
        </div>
        
        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments-msg">No comments yet. Start the conversation!</p>
          ) : (
            comments.map((c) => (
              <div key={c._id} className="comment-bubble">
                <div className="comment-avatar">{(c.user?.username || c.user?.email || 'U')[0].toUpperCase()}</div>
                <div className="comment-content-main">
                  <div className="comment-meta">
                    <span className="comment-author-name">{c.user?.username || c.user?.email?.split('@')[0] || 'Unknown User'}</span>
                    <span className="comment-timestamp">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="comment-text-body">{c.comment}</p>
                </div>
                {String(c.user?._id || c.user) === String(currentUserId) && (
                  <button onClick={() => handleDeleteComment(c._id)} className="delete-comment-btn" title="Delete">
                    🗑️
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;