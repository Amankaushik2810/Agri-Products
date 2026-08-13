import React, { useState } from 'react';
import './ListProduct.css';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import axios from 'axios';

const ListProduct = () => {
  const [formData, setFormData] = useState({
    location: '',
    duration: '',
    description: '',
    startingAmount: '',
    auctionEndTime: '',
    productImage: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      productImage: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('location', formData.location);
    data.append('duration', formData.duration);
    data.append('description', formData.description);
    data.append('startingAmount', formData.startingAmount);
    data.append('endTime', formData.auctionEndTime);

    if (formData.productImage) {
      data.append('productImage', formData.productImage);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('https://agri-products.onrender.com/api/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Product listed successfully!');
    } catch (err) {
      console.error(err);
      alert('Error listing product.');
    }
  };

  return (
    <div>
      <Header />
      <div className="list-product-container">
        <h2>List Your Product for Auction</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>📍 Location:</label>
            <input type="text" name="location" value={formData.location} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label>🌾 Duration (in years):</label>
            <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label>📝 Description:</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label>💰 Starting Amount:</label>
            <input type="number" name="startingAmount" value={formData.startingAmount} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label>⏳ Auction End Time:</label>
            <input type="datetime-local" name="auctionEndTime" value={formData.auctionEndTime} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label>📷 Upload Product Image:</label>
            <input type="file" name="productImage" accept="image/*" onChange={handleFileChange} />
          </div>

          <button type="submit" className="submit-btn">🚀 Submit Listing</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ListProduct;
