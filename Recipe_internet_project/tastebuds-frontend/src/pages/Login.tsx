import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { setTokens } from '../utils/auth';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import './Auth.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      const { token, refreshToken, username, userProfilePic } = response.data;
      setTokens(token, refreshToken, email, userProfilePic, username);
      navigate('/recipes');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      setError('');
      const response = await authAPI.googleLogin(credentialResponse.credential);
      const { token, refreshToken, email: resEmail, username, userProfilePic } = response.data;
      setTokens(token, refreshToken, resEmail || '', userProfilePic, username);
      navigate('/recipes');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="floating-element testimonial testimonial-1">
          <div className="testimonial-card">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p>"Best recipe platform ever! Found my new favorite dish here."</p>
            <span className="author">- Sarah M.</span>
          </div>
        </div>
        
        <div className="floating-element testimonial testimonial-2">
          <div className="testimonial-card">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p>"The community is amazing. Love sharing my recipes!"</p>
            <span className="author">- David K.</span>
          </div>
        </div>

        <div className="floating-element testimonial testimonial-3">
          <div className="testimonial-card">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p>"Easy to use and beautifully designed. Highly recommend!"</p>
            <span className="author">- Emma L.</span>
          </div>
        </div>

        <div className="floating-element testimonial testimonial-4">
          <div className="testimonial-card">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p>"Thousands of recipes at my fingertips. Cook with confidence!"</p>
            <span className="author">- Michael R.</span>
          </div>
        </div>

        <div className="floating-element testimonial testimonial-5">
          <div className="testimonial-card">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p>"Love the clean interface and helpful community!"</p>
            <span className="author">- Lisa P.</span>
          </div>
        </div>

        <div className="floating-element testimonial testimonial-6">
          <div className="testimonial-card">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p>"My go-to app for meal planning. Simply amazing!"</p>
            <span className="author">- James T.</span>
          </div>
        </div>

        <div className="floating-element testimonial testimonial-7">
          <div className="testimonial-card">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p>"Perfect for discovering new cuisines and flavors!"</p>
            <span className="author">- Maria G.</span>
          </div>
        </div>

        <div className="floating-element testimonial testimonial-8">
          <div className="testimonial-card">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p>"Finally, a recipe site that gets it right!"</p>
            <span className="author">- Alex C.</span>
          </div>
        </div>

        <div className="floating-element food-item food-1">
          <div className="food-card">
            <span className="food-emoji">🍝</span>
            <span className="food-name">Classic Pasta Carbonara</span>
          </div>
        </div>

        <div className="floating-element food-item food-2">
          <div className="food-card">
            <span className="food-emoji">🍕</span>
            <span className="food-name">Margherita Pizza</span>
          </div>
        </div>

        <div className="floating-element food-item food-3">
          <div className="food-card">
            <span className="food-emoji">🍰</span>
            <span className="food-name">Chocolate Lava Cake</span>
          </div>
        </div>

        <div className="floating-element food-item food-4">
          <div className="food-card">
            <span className="food-emoji">🥗</span>
            <span className="food-name">Mediterranean Salad</span>
          </div>
        </div>

        <div className="floating-element food-item food-5">
          <div className="food-card">
            <span className="food-emoji">🍜</span>
            <span className="food-name">Ramen Bowl</span>
          </div>
        </div>

        <div className="floating-element food-item food-6">
          <div className="food-card">
            <span className="food-emoji">🌮</span>
            <span className="food-name">Fish Tacos</span>
          </div>
        </div>

        <div className="floating-element food-item food-7">
          <div className="food-card">
            <span className="food-emoji">🍔</span>
            <span className="food-name">Gourmet Burger</span>
          </div>
        </div>

        <div className="floating-element food-item food-8">
          <div className="food-card">
            <span className="food-emoji">🍣</span>
            <span className="food-name">Sushi Rolls</span>
          </div>
        </div>

        <div className="floating-element food-item food-9">
          <div className="food-card">
            <span className="food-emoji">🥘</span>
            <span className="food-name">Paella</span>
          </div>
        </div>

        <div className="floating-element food-item food-10">
          <div className="food-card">
            <span className="food-emoji">🍲</span>
            <span className="food-name">Thai Curry</span>
          </div>
        </div>

        <div className="floating-element food-item food-11">
          <div className="food-card">
            <span className="food-emoji">🥙</span>
            <span className="food-name">Falafel Wrap</span>
          </div>
        </div>

        <div className="floating-element food-item food-12">
          <div className="food-card">
            <span className="food-emoji">🍛</span>
            <span className="food-name">Chicken Tikka Masala</span>
          </div>
        </div>
      </div>

      <div className="auth-form">
        <h1>🍽️ TasteBuds Login</h1>
        <p className="welcome-text">Welcome back to your culinary journey!</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ margin: '20px 0', textAlign: 'center', color: '#666' }}>
          <hr style={{ border: 'none', borderTop: '1px solid #ddd', marginBottom: '15px' }} />
          Or continue with
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
          {/* הוספנו את העטיפה של ה-Provider כאן מסביב לכפתור */}
          <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ""}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google login failed.')}
              theme="outline"
              size="large"
            />
          </GoogleOAuthProvider>
        </div>

        <p className="auth-link" style={{ textAlign: 'center' }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;