import React, { useState, useEffect, useCallback } from 'react';
import { userAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import Input from '../components/Input';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import './Profile.css';

const Profile = () => {
  const { updateUser } = useAuth();
  const { success, error: showError } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userAPI.getProfile();
      setUser(response.data.user);
      setFormData({
        fullName: response.data.user.fullName,
        email: response.data.user.email,
      });
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const validateProfile = () => {
    const newErrors = {};

    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!validateProfile()) {
      return;
    }

    setSaving(true);
    try {
      const response = await userAPI.updateProfile(formData);
      setUser(response.data.user);
      updateUser(response.data.user); // Update auth context
      success('Profile updated successfully');
      setEditMode(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      if (err.response?.data?.errors) {
        const validationErrors = {};
        err.response.data.errors.forEach((error) => {
          if (error.param) {
            validationErrors[error.param] = error.msg;
          }
        });
        setErrors(validationErrors);
      } else {
        showError(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setSaving(true);
    try {
      await userAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      success('Password changed successfully');
      setPasswordMode(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setPasswordMode(false);
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
    });
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setErrors({});
  };

  if (loading) {
    return (
      <div className="profile-container">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1 className="profile-title">My Profile</h1>

        {!editMode && !passwordMode && (
          <div className="profile-info">
            <div className="profile-field">
              <label>Full Name</label>
              <p>{user?.fullName}</p>
            </div>
            <div className="profile-field">
              <label>Email</label>
              <p>{user?.email}</p>
            </div>
            <div className="profile-field">
              <label>Role</label>
              <p>
                <span className={`role-badge role-${user?.role}`}>
                  {user?.role}
                </span>
              </p>
            </div>
            <div className="profile-field">
              <label>Status</label>
              <p>
                <span className={`status-badge status-${user?.status}`}>
                  {user?.status}
                </span>
              </p>
            </div>
            <div className="profile-actions">
              <Button variant="primary" onClick={() => setEditMode(true)}>
                Edit Profile
              </Button>
              <Button variant="secondary" onClick={() => setPasswordMode(true)}>
                Change Password
              </Button>
            </div>
          </div>
        )}

        {editMode && (
          <form onSubmit={handleSaveProfile} className="profile-form">
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleProfileChange}
              error={errors.fullName}
              required
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleProfileChange}
              error={errors.email}
              required
            />
            <div className="profile-form-actions">
              <Button type="submit" variant="primary" loading={saving}>
                Save
              </Button>
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {passwordMode && (
          <form onSubmit={handleChangePassword} className="profile-form">
            <Input
              label="Current Password"
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              error={errors.currentPassword}
              required
            />
            <Input
              label="New Password"
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              error={errors.newPassword}
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              error={errors.confirmPassword}
              required
            />
            <div className="profile-form-actions">
              <Button type="submit" variant="primary" loading={saving}>
                Change Password
              </Button>
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;

