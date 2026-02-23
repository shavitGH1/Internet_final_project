import React, { useState, FormEvent, ChangeEvent, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, fileAPI } from '../services/api'; // הוספנו את fileAPI
import { setTokens } from '../utils/auth';
import './Auth.css';

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>(''); 
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [profilePic, setProfilePic] = useState<string>(''); 
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // --- הפונקציה המעודכנת שמעלה את תמונת הפרופיל לשרת בזמן ההרשמה ---
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // תצוגה מקדימה מידית למשתמש
      const localPreviewUrl = URL.createObjectURL(file);
      setImagePreview(localPreviewUrl);

      try {
        // מעלה את התמונה לשרת ומקבל את הלינק
        const response = await fileAPI.uploadImage(file);
        setProfilePic(response.url);
      } catch (err) {
        console.error("Failed to upload image", err);
        setError("Failed to upload profile picture to server.");
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register(email, username, password, profilePic);
      const { token, refreshToken, userProfilePic } = response.data;
      
      setTokens(token, refreshToken, email, userProfilePic, username);
      navigate('/recipes');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          
          <div className="form-group image-upload-group">
            <label>Profile Picture:</label>
            <div className="profile-image-preview-container" onClick={() => fileInputRef.current?.click()}>
              {imagePreview ? (
                <img src={imagePreview} alt="Profile Preview" className="profile-preview-img" />
              ) : (
                <div className="profile-placeholder">
                  <i className="bi bi-camera"></i>
                  <span>Upload</span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

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
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Choose a username"
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;