import React, { useState, useRef } from 'react';
import { userAPI, fileAPI } from '../services/api'; // הוספנו את fileAPI
import './Profile.css';

const Profile: React.FC = () => {
  const initialUsername = localStorage.getItem('userUsername') || '';
  const initialPic = localStorage.getItem('profilePic') || '/avatar.png';
  const userEmail = localStorage.getItem('userEmail') || '';

  const [username, setUsername] = useState(initialUsername);
  const [profilePic, setProfilePic] = useState(initialPic);
  const [isEditingName, setIsEditingName] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null); // רפרנס לאינפוט הנסתר של התמונה

  const hasChanges = username !== initialUsername || profilePic !== initialPic;

  // --- הפונקציה המעודכנת ששולחת את התמונה לשרת שלנו ---
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. קודם כל מציגים תצוגה מקדימה מידית למשתמש
      const localPreviewUrl = URL.createObjectURL(file);
      setProfilePic(localPreviewUrl);

      // 2. מעלים את התמונה לשרת ומקבלים את הלינק
      try {
        const response = await fileAPI.uploadImage(file);
        // מעדכנים את הסטייט עם הלינק האמיתי שחזר מהשרת
        setProfilePic(response.url);
      } catch (err) {
        console.error("Failed to upload image", err);
        alert("Failed to upload image to server.");
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await userAPI.updateProfile(profilePic, username);
      localStorage.setItem('userUsername', username);
      localStorage.setItem('profilePic', profilePic);
      setIsEditingName(false);
      window.location.reload(); 
    } catch (err) {
      alert("Failed to save profile. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page-wrapper">
      <div className="profile-card">
        <h1>My Profile</h1>
        
        <div className="profile-image-container">
          <div className="avatar-circle">
            <img 
              src={profilePic || '/avatar.png'} 
              alt="Profile" 
              className="avatar-img"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/avatar.png';
              }}
            />
            {/* כפתור המצלמה להחלפת תמונה */}
            <div className="camera-overlay" onClick={() => fileInputRef.current?.click()}>
              <i className="bi bi-camera-fill"></i>
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className="profile-details">
          <div className="detail-row">
            <label>Email</label>
            <div className="detail-value">{userEmail}</div>
          </div>

          <div className="detail-row">
            <label>Username</label>
            <div className="username-edit-container">
              {isEditingName ? (
                <input 
                  className="username-input"
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  autoFocus 
                />
              ) : (
                <div className="detail-value">{username}</div>
              )}
              <i 
                className="bi bi-pen edit-pencil-icon" 
                onClick={() => setIsEditingName(!isEditingName)}
              ></i>
            </div>
          </div>
        </div>

        {hasChanges && (
          <div className="profile-actions-footer">
            <button className="action-btn save" onClick={handleSave} disabled={loading}>
              {loading ? '...' : 'Save'}
            </button>
            <button className="action-btn cancel" onClick={() => {
              setUsername(initialUsername);
              setProfilePic(initialPic);
              setIsEditingName(false);
            }}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;