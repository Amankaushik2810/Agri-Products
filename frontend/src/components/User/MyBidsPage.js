import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { AuthContext } from "../../context/AuthContext";
import "./MyBidsPage.css";

const MyBidsPage = () => {
  const { token } = useContext(AuthContext);
  const [landBids, setLandBids] = useState([]);
  const [productBids, setProductBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBids = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/bids/my-bids", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLandBids(res.data.landBids || []);
        setProductBids(res.data.productBids || []);
      } catch (err) {
        console.error("Error fetching bids:", err);
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [token, navigate]);

  // Build full image URL from relative file path
  const getImageUrl = (path) => {
    if (!path) return null;
    const cleanedPath = path.replace(/^\/?uploads\/?/, ""); // remove /uploads/ or uploads/ prefix
    return `https://agri-products.onrender.com/uploads/${cleanedPath}`;
  };

  return (
    <>
      <Header />
      <div className="my-bids-page">
        <h2>📑 My Bids</h2>

        {loading ? (
          <p className="loading">Loading your bids...</p>
        ) : landBids.length === 0 && productBids.length === 0 ? (
          <p className="no-bids">You haven’t placed any bids yet.</p>
        ) : (
          <>
            {/* LAND BIDS */}
            {landBids.length > 0 && (
              <>
                <h3>🌾 Land Bids</h3>
                <div className="bid-listing-grid">
                  {landBids.map((bid) => {
                    const imageUrl = bid.landId?.images?.[0]
                      ? getImageUrl(bid.landId.images[0])
                      : null;

                    return (
                      <div
                        className="bid-card clickable"
                        key={bid._id}
                        onClick={() => navigate(`/ongoing-bid/${bid.landId?._id}`)}
                      >
                        {imageUrl ? (
                          <img src={imageUrl} alt="Land" className="bid-image" />
                        ) : (
                          <div className="placeholder-image">No Image</div>
                        )}

                        <div className="bid-info">
                          <h3>{bid.landId?.title || "Land Plot"}</h3>
                          <p><strong>📍 Location:</strong> {bid.landId?.location || "N/A"}</p>
                          <p><strong>🌱 Type:</strong> {bid.landId?.type || "N/A"}</p>
                          <p><strong>💰 My Bid:</strong> ₹{bid.bidAmount}</p>
                          <p><strong>💵 Current:</strong> ₹{bid.landId?.currentAmount || "N/A"}</p>
                          <p>
                            <strong>🕐 Auction:</strong>{" "}
                            {bid.landId?.startTime && bid.landId?.endTime
                              ? `${new Date(bid.landId.startTime).toLocaleString()} - ${new Date(bid.landId.endTime).toLocaleString()}`
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* PRODUCT BIDS */}
            {productBids.length > 0 && (
              <>
                <h3>🧺 Product Bids</h3>
                <div className="bid-listing-grid">
                  {productBids.map((bid) => {
                    const imageUrl = bid.productId?.images?.[0]
                      ? getImageUrl(bid.productId.images[0])
                      : null;

                    return (
                      <div
                        className="bid-card clickable"
                        key={bid._id}
                        onClick={() => navigate(`/product/${bid.productId?._id}`)}
                      >
                        {imageUrl ? (
                          <img src={imageUrl} alt="Product" className="bid-image" />
                        ) : (
                          <div className="placeholder-image">No Image</div>
                        )}

                        <div className="bid-info">
                          <h3>{bid.productId?.title || "Product"}</h3>
                          <p><strong>📍 Location:</strong> {bid.productId?.location || "Not specified"}</p>
                          <p>
                            <strong>📅 Listed On:</strong>{" "}
                            {new Date(bid.productId?.createdAt).toLocaleDateString()}
                          </p>
                          <p><strong>💰 My Bid:</strong> ₹{bid.bidAmount}</p>
                          <p><strong>💵 Current:</strong> ₹{bid.productId?.currentAmount || "N/A"}</p>
                          <p><strong>🕐 Bid Time:</strong> {new Date(bid.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyBidsPage;
