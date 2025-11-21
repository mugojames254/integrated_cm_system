import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    email: '',
    full_name: '',
    phone: ''
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await usersAPI.getProfile();
      const userData = response.data;
      setProfile({
        email: userData.email,
        full_name: userData.full_name || '',
        phone: userData.phone || ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      await usersAPI.updateProfile(profile);
      updateUser({ ...user, ...profile });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to update profile' 
      });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    try {
      await usersAPI.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to change password' 
      });
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      {message.text && (
        <div className={message.type === 'success' ? 'success-message' : 'error-message'}>
          {message.text}
        </div>
      )}

      <div className="profile-content">
        <div className="card profile-info">
          <h2>Profile Information</h2>
          <div className="user-details">
            <div className="detail-item">
              <strong>Username:</strong>
              <span>{user?.username}</span>
            </div>
            <div className="detail-item">
              <strong>Role:</strong>
              <span className="role-badge">{user?.role}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Update Profile</h2>
          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Update Profile
            </button>
          </form>
        </div>

        <div className="card">
          <h2>Change Password</h2>
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label>Current Password *</label>
              <input
                type="password"
                value={passwordData.current_password}
                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>New Password *</label>
              <input
                type="password"
                value={passwordData.new_password}
                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                required
                minLength="6"
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password *</label>
              <input
                type="password"
                value={passwordData.confirm_password}
                onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
