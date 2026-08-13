import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; 
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import './ListLand.css';

const EditLand = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    location: '',
    type: '',
    startingAmount: '',
    startTime: '',
    endTime: '',
    images: [],
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  useEffect(() => {
    const fetchLand = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
  alert("User not authenticated.");
  return;
}

        const res = await fetch(`https://agri-products.onrender.com/api/land/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        const toDatetimeLocal = (utcDateStr) => {
          const local = new Date(utcDateStr);
          local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
          return local.toISOString().slice(0, 16);
        };

        if (res.ok) {
          setFormData({
            location: data.location,
            type: data.type,
            startingAmount: data.startingAmount,
            startTime: toDatetimeLocal(data.startTime),
            endTime: toDatetimeLocal(data.endTime),
            images: [],
          });
          setExistingImages(data.images);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error(error);
        alert('Failed to fetch land details.');
      }
    };

    fetchLand();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));
    setNewImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();

    data.append('location', formData.location);
    data.append('type', formData.type);
    data.append('startingAmount', formData.startingAmount);
    data.append('startTime', formData.startTime);
    data.append('endTime', formData.endTime);
    formData.images.forEach((img) => data.append('images', img));

    try {
      const res = await fetch(`https://agri-products.onrender.com/api/land/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        alert('Land listing updated successfully!');
        navigate('/user/my-listings');
      } else {
        alert(result.message || 'Update failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  };

  return (
    <>
      <Header />
      <div className="list-land-container">
        <h2 className="page-title">🛠️ Edit Your Land Listing</h2>
        <div className="form-section">
          <div className="image-upload">
            <div className="upload-box">
              {(newImagePreviews.length > 0 || existingImages.length > 0) ? (
                <div className="preview-grid">
                  {newImagePreviews.length > 0
                    ? newImagePreviews.map((src, idx) => (
                        <img key={idx} src={src} alt={`preview-${idx}`} className="preview-image" />
                      ))
                    : existingImages.map((img, idx) => (
                        <img
                          key={idx}
                          src={`https://agri-products.onrender.com/uploads/${img}`}
                          alt={`existing-${idx}`}
                          className="preview-image"
                        />
                      ))}
                </div>
              ) : (
                <p className="placeholder-text">Image Preview Box</p>
              )}
            </div>
            <label htmlFor="file-upload" className="upload-btn">📁 Upload New Images</label>
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
            <label>💰 Starting Amount:
              <input type="number" name="startingAmount" value={formData.startingAmount} onChange={handleChange} required />
            </label>
            <label>⏰ Auction Start Time:
              <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} required />
            </label>
            <label>⏳ Auction End Time:
              <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} required />
            </label>
            <button type="submit" className="submit-btn">💾 Save Changes</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditLand;
