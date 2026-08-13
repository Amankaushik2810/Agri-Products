import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditProfile.css';
import Header from '../Common/Header';
import Footer from '../Common/Footer';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://agri-products.onrender.com/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData(prev => ({
          ...prev,
          name: res.data.name,
          email: res.data.email
        }));
      } catch (error) {
        setMessage('Failed to load user data.');
      }
    };
    fetchUserData();
  }, []);

  const handleChange = e => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
      setMessage('New passwords do not match.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('https://agri-products.onrender.com/api/user/update-profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.message || 'Profile updated successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Update failed.');
    }
  };

  return (
<div>
    <Header />
      <div className="edit-profile-container">
       
      <h2>Edit Profile</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Current Password</label>
        <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} />

        <label>New Password</label>
        <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} />

        <label>Confirm New Password</label>
        <input type="password" name="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleChange} />

        <button type="submit">Update Profile</button>
      </form>
    </div>
    <Footer />
    </div>
  );
};

export default EditProfile;
