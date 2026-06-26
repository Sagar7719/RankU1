import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaLock, FaBell, FaCamera, FaTrash } from 'react-icons/fa';
import "./Settings.css";

const getProfilePictureUrl = (pic) => {
  if (!pic) return null;
  if (pic.startsWith('data:') || pic.startsWith('http://') || pic.startsWith('https://')) {
    return pic;
  }
  const serverUrl = '  ';
  if (pic.startsWith('/')) {
    return `${serverUrl}${pic}`;
  }
  return `${serverUrl}/${pic}`;
};

const Settings = () => {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile states
  const [name, setName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setProfilePicture(user.profilePicture || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      await api.put('/users/profile', { name, profilePicture });
      await refreshUser();
      alert("Profile updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("File size too large. Please choose an image under 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicture(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return alert("New passwords do not match.");
    try {
      setPasswordLoading(true);
      await api.put('/users/password', { currentPassword, newPassword });
      alert("Password updated successfully");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="settings-dashboard">
      {/* SIDEBAR */}
      <div className="settings-sidebar">
        <div className="sidebar-user-info">
          {user?.profilePicture ? (
            <img src={getProfilePictureUrl(user.profilePicture)} alt="User" className="sidebar-avatar" />
          ) : (
            <div className="sidebar-avatar">{(user?.name || "U").charAt(0).toUpperCase()}</div>
          )}
          <h3>{user?.name}</h3>
          <p>{user?.email}</p>
        </div>

        <nav className="settings-nav">
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser className="nav-icon" /> Profile Settings
          </button>
          <button 
            className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <FaLock className="nav-icon" /> Security & Password
          </button>
          <button className="nav-item" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            <FaBell className="nav-icon" /> Notifications
          </button>
        </nav>
      </div>

      {/* CONTENT */}
      <div className="settings-content">
        {activeTab === 'profile' ? (
          <div className="settings-form-wrapper">
            <div className="content-header">
              <h2>Profile Settings</h2>
              <p>Manage your public profile and personal information.</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="loginForm" style={{ background: 'transparent', padding: 0, boxShadow: 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                <div className="profile-image-container" style={{ position: 'relative' }}>
                  <div style={{
                    width: '130px',
                    height: '130px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '4px solid var(--accent-primary)',
                    background: 'var(--bg-accent)'
                  }}>
                    {profilePicture ? (
                      <img src={getProfilePictureUrl(profilePicture)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'var(--accent-primary)' }}>
                        {(name || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <label htmlFor="profile-upload" style={{
                    position: 'absolute', bottom: '5px', right: '5px',
                    background: 'var(--accent-primary)', color: 'white',
                    width: '36px', height: '36px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', border: '3px solid var(--bg-secondary)'
                  }}>
                    <FaCamera size={18} />
                    <input id="profile-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                  </label>
                </div>
                {profilePicture && (
                  <button type="button" onClick={() => setProfilePicture('')} style={{ marginTop: '10px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FaTrash size={12} /> Remove photo
                  </button>
                )}
              </div>

              <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Enter your full name" />

              <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1.5rem' }}>Avatar URL (Optional)</label>
              <input 
                type="text" 
                value={profilePicture.startsWith('data:') ? 'Local Image Selected' : profilePicture} 
                onChange={e => setProfilePicture(e.target.value)}
                disabled={profilePicture.startsWith('data:')}
                placeholder="https://..."
              />

              <button type="submit" disabled={profileLoading} style={{ marginTop: '2rem' }}>
                {profileLoading ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </form>
          </div>
        ) : (
          <div className="settings-form-wrapper">
            <div className="content-header">
              <h2>Security Settings</h2>
              <p>Keep your account secure by updating your password regularly.</p>
            </div>

            <form onSubmit={handleChangePassword} className="loginForm" style={{ background: 'transparent', padding: 0, boxShadow: 'none' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Current Password</label>
              <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required placeholder="Enter current password" />

              <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1.5rem' }}>New Password</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength="6" placeholder="At least 6 characters" />

              <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1.5rem' }}>Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength="6" placeholder="Repeat new password" />

              <button type="submit" disabled={passwordLoading} style={{ marginTop: '2rem' }}>
                {passwordLoading ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
