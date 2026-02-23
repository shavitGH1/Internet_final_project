import React, { useState, useRef } from 'react';
import { userAPI } from '../services/api';
import './Profile.css';

const Profile: React.FC = () => {
  const initialUsername = localStorage.getItem('userUsername') || '';
  const initialPic = localStorage.getItem('profilePic') || '/avatar.png';
  const userEmail = localStorage.getItem('userEmail') || '';

  const [username, setUsername] = useState(initialUsername);
  const [profilePic, setProfilePic] = useState(initialPic);
  const [isEditingName, setIsEditingName] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasChanges = username !== initialUsername || profilePic !== initialPic;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result as string);
      reader.readAsDataURL(file);
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
      alert("Failed to update profile");
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
            {/* הוספת התיקון כאן: onError מחליף תמונה שבורה בתמונת ברירת המחדל */}
            <img 
              src={profilePic || '/avatar.png'} 
              alt="Profile" 
              className="avatar-img" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null; // מונע לופ אינסופי אם גם התמונה הדיפולטיבית חסרה
                target.src = '/avatar.png';
              }}
            />
            <label htmlFor="file-upload" className="camera-overlay">
              <i className="bi bi-camera-fill"></i>
            </label>
            <input id="file-upload" type="file" onChange={handleImageChange} hidden accept="image/*" />
          </div>
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