import React, { useEffect, useState, useContext } from "react";
import "./UserDashboard.css";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserDashboard = () => {
  const { token, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDataAndListings = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const userRes = await axios.get("https://agri-products.onrender.com/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(userRes.data);

        const listingsRes = await axios.get("https://agri-products.onrender.com/api/land/my-listings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMyListings(listingsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndListings();
  }, [token, navigate]);

  const handleLogout = () => {
    if (logout) logout();
    else localStorage.clear();

    toast.success("Logged out successfully!", {
      position: "top-center",
      autoClose: 2000,
      onClose: () => navigate("/login"),
    });
  };

  return (
    <div className="dashboard-container">
      <Header />

      <div className="dashboard-content">
        <section className="welcome-section">
          <h2>Welcome back, {loading ? "..." : userData?.name || "User"} 👋</h2>
          <p>Your role: <strong>{userData?.role || "User"}</strong></p>
        </section>

        <section className="quick-actions">
          <button onClick={() => navigate("/list-land")}>📌 List New Land</button>
          <button onClick={() => navigate("/my-listings")}>📄 My Land Listings</button>
          <button onClick={() => navigate("/my-bids")}>💰 My Bids</button>
          <button onClick={() => navigate("/edit-profile")}>✏️ Edit Profile</button>
          <button onClick={() => navigate("/my-wins")}>🏆My Wins</button>

          <button onClick={handleLogout}>📴 Log-Out</button>
        </section>
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default UserDashboard;
