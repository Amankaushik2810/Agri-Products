import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import './ListLand.css';

const ListLand = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    location: '',
    type: '',
    startingAmount: '',
    startTime: '',
    endTime: '',
    images: [],
    description: '', // ✅ Added
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: files }));
    setImagePreviews(files.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('location', formData.location);
    data.append('type', formData.type);
    data.append('startingAmount', formData.startingAmount);
    data.append('startTime', formData.startTime);
    data.append('endTime', formData.endTime);
    data.append('description', formData.description); // ✅ Added
    formData.images.forEach(img => data.append('images', img));

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        alert("You're not logged in!");
        return;
      }

      const res = await fetch('https://agri-products.onrender.com/api/land', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          
        },
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        alert("Land successfully listed!");
        navigate('/user');
      } else {
        alert(result.message || "Failed to list land.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <>
      <Header />
      <div className="list-land-container">
        <h2 className="page-title">🌿 List Your Land for Auction</h2>
        <div className="form-section">
          <div className="image-upload">
            <div className="upload-box">
              {imagePreviews.length > 0 ? (
                <div className="preview-grid">
                  {imagePreviews.map((src, index) => (
                    <img key={index} src={src} alt={`preview-${index}`} className="preview-image" />
                  ))}
                </div>
              ) : (
                <p className="placeholder-text">Image Preview Box</p>
              )}
            </div>
            <label htmlFor="file-upload" className="upload-btn">📁 Select Pictures</label>
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>

          <form className="land-form" onSubmit={handleSubmit}>
            <label>📍 Location:
              <input type="text" name="location" value={formData.location} onChange={handleChange} required />
            </label>
            <label>🌾 Land Type:
              <input type="text" name="type" value={formData.type} onChange={handleChange} required />
            </label>
            <label>📝 Description:
              <textarea
                name="description"
                className="description-input"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
              />
            </label>
            <label>💰 Starting Amount:
              <input type="number" name="startingAmount" value={formData.startingAmount} onChange={handleChange} required />
            </label>
            <label>⏰ Auction Start Time:
              <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} required />
            </label>
            <label>⏳ Auction End Time:
              <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} required />
            </label>
            
            <button type="submit" className="submit-btn">🚀 Submit Listing</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ListLand;