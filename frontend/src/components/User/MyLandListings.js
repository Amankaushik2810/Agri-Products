import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { AuthContext } from "../../context/AuthContext";
import "./MyLandListings.css";
import { formatToIST } from '../../utils/timeUtils';


const MyLandListings = () => {
  const { token } = useContext(AuthContext);
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyListings = async () => {
      // First check if we have a token
      if (!token) {
        console.warn("No token found, redirecting to login");
        navigate("/login");
        return;
      }
      
      try {
        const res = await axios.get('https://agri-products.onrender.com/api/lands/my-listings', {

          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched listings:", res.data);
        setLands(res.data);
      } catch (err) {
        console.error("Error fetching my listings:", err.response?.data || err.message);
        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, [token, navigate]);

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this listing?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`https://agri-products.onrender.com/api/land/${id}`, { // ✅ full backend URL
      headers: { Authorization: `Bearer ${token}` },
    });
    setLands((prev) => prev.filter((item) => item._id !== id));
  } catch (err) {
    console.error("Failed to delete listing:", err.response?.data || err.message);
    alert('Failed to delete land. Please try again.');
  }
};


  return (
    <>
      <Header />
      <div className="my-land-listings">
        <h2>🌾 My Land Listings</h2>

        {loading ? (
          <p className="loading">Loading your listings...</p>
        ) : lands.length === 0 ? (
          <p className="no-listings">You haven't listed any land yet.</p>
        ) : (
          <div className="land-listing-grid">
            {lands.map((land) => (
              <div className="land-card" key={land._id}>
                {land.images && land.images.length > 0 ? (
                  <img
                    src={`https://agri-products.onrender.com/uploads/${land.images[0]}`}
                    alt="Land"
                    className="land-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="placeholder-image">No Image Available</div>
                )}
                <div className="land-info">
                  <h3>{land.title || "Land Plot"}</h3>
                  <p><strong>📍 Location:</strong> {land.location}</p>
                  <p><strong>🌱 Type:</strong> {land.type}</p>
                  <p><strong>💰 Start:</strong> ₹{land.startingAmount}</p>
                  <p><strong>🕐 Auction:</strong> {formatToIST(land.startTime)} - {formatToIST(land.endTime)}</p>

                  <div className="listing-actions">
                    <button onClick={() => navigate(`/edit-land/${land._id}`)}>✏️ Edit</button>
                    <button onClick={() => handleDelete(land._id)}>🗑️ Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyLandListings;