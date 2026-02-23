import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { recipesAPI, Recipe } from '../services/api';
import { getCurrentUserId } from '../utils/auth';
import './Recipes.css';

const MyRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const currentUserId = getCurrentUserId();

  const observer = useRef<IntersectionObserver | null>(null);
  
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    }, { threshold: 0.5 });

    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  useEffect(() => {
    fetchMyRecipes(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchMyRecipes(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchMyRecipes = async (pageNum: number) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const response = await recipesAPI.getAllRecipes(pageNum, 6, currentUserId || undefined);
      
      if (pageNum === 1) {
        setRecipes(response.data);
      } else {
        setRecipes(prev => [...prev, ...response.data]);
      }

      if (response.data.length < 6) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      setError('');
    } catch (err: any) {
      setError('Failed to load recipes. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLike = async (e: React.MouseEvent, recipeId: string) => {
    e.preventDefault();
    try {
      const response = await recipesAPI.toggleFavorite(recipeId);
      setRecipes(prevRecipes => 
        prevRecipes.map(r => 
          r._id === recipeId ? { ...r, favorites: response.data.favorites } : r
        )
      );
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    }
  };

  const filteredRecipes = recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading your recipes...</div>;
  }

  return (
    <div className="recipes-container">
      <div className="recipes-header">
        <h1>My Recipes</h1>
      </div>

      {recipes.length > 0 && (
        <div className="recipes-controls" style={{ justifyContent: 'center' }}>
          <div className="search-wrapper" style={{ maxWidth: '600px', width: '100%' }}>
            <input 
              type="text" 
              className="search-input" 
              placeholder="🔍 Search my recipes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {recipes.length === 0 ? (
        <div className="no-recipes">
          <p>You haven't created any recipes yet. Start by adding your first recipe!</p>
        </div>
      ) : filteredRecipes.length === 0 && !hasMore ? (
        <div className="no-recipes">
          <p>No recipes match your search. 🤷‍♂️</p>
        </div>
      ) : (
        <>
          <div className="recipes-grid">
            {filteredRecipes.map((recipe) => {
              const favoritesList = (recipe.favorites || []) as any[];
              const isLiked = favoritesList.includes(currentUserId);

              return (
                <div key={recipe._id} className="recipe-card" style={{ position: 'relative' }}>
                  <div 
                    className="like-icon-container"
                    onClick={(e) => handleLike(e, recipe._id!)}
                    style={{
                      position: 'absolute', top: '10px', right: '10px', zIndex: 2,
                      background: 'rgba(255, 255, 255, 0.8)', borderRadius: '50%',
                      width: '35px', height: '35px', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', cursor: 'pointer'
                    }}
                  >
                    <i 
                      className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}`} 
                      style={{ color: isLiked ? '#ff4d4d' : '#666', fontSize: '1.2rem' }}
                    ></i>
                  </div>

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
                      <p className="recipe-author">
                        {recipe.user && typeof recipe.user === 'object' ? (recipe.user as any).username : 'Me'}
                      </p>
                      
                      <div className="recipe-card-stats">
                        <span className="stat-item">❤️ {recipe.favorites?.length || 0}</span>
                        <span className="stat-item">💬 {recipe.commentCount || 0}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* אלמנט הגלילה עם ספינר הטעינה */}
          {hasMore && (
            <div ref={lastElementRef} style={{ height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px' }}>
              {loadingMore && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <div className="ai-spinner" style={{ width: '35px', height: '35px', borderWidth: '4px', margin: '0' }}></div>
                  <div style={{ color: '#ff6a88', fontWeight: 'bold', fontSize: '1.1rem', animation: 'pulseText 1.5s infinite' }}>
                    Loading more tasty recipes... 🍳
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyRecipes;