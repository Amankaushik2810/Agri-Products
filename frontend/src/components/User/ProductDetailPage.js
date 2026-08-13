import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import ChatWindow from '../Chat/ChatWindow';
import './OngoingBidDetailPage.css'; // Reuse styling for consistency

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [currentBid, setCurrentBid] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bidLoading, setBidLoading] = useState(false);
  const [error, setError] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [chatWithUserId, setChatWithUserId] = useState(null);

  // Fetch product details
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`https://agri-products.onrender.com/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetched = res.data.product;
      setProduct(fetched);
      setCurrentBid(fetched.currentAmount || fetched.startingAmount);
    } catch (err) {
      console.error('[ProductDetailPage] Error fetching product:', err);
      setError('Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const handleBidSubmit = async () => {
    setError('');
    const bid = parseFloat(bidAmount);

    if (isNaN(bid) || bid <= 0) {
      setError("Please enter a valid bid amount.");
      return;
    }

    if (bid <= currentBid) {
      setError("Your bid must be higher than the current highest bid.");
      return;
    }

    setBidLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'https://agri-products.onrender.com/api/product-bids/place',
        {
          productId: id,
          bidAmount: bid,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(res.data.message || "Bid placed successfully");
      setBidAmount('');
      fetchProduct(); // Refresh product info
    } catch (err) {
      console.error('[ProductDetailPage] Bid failed:', err);
      setError(err.response?.data?.error || "Failed to place bid");
    } finally {
      setBidLoading(false);
    }
  };

  const timeLeft = product ? new Date(product.endTime) - new Date() : 0;
  const minutesLeft = Math.floor(timeLeft / 1000 / 60);
  const auctionEnded = minutesLeft <= 0;

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>{error || 'No product found.'}</div>;

  return (
    <div>
      <Header />
      <div className="land-detail-container">
        {/* Product Images */}
        <div className="land-images">
          {Array.isArray(product.images) && product.images.length > 0 ? (
            product.images.map((img, index) => (
              <img
                key={index}
                src={`https://agri-products.onrender.com/${img.replace(/\\/g, '/')}`}
                alt={`Product ${index}`}
              />
            ))
          ) : (
            <p>No images available</p>
          )}
        </div>

        {/* Product Info */}
        <div className="land-content">
          <div className="land-info">
            <p><strong>Location:</strong> {product.location}</p>
            <p><strong>Description:</strong> {product.description}</p>
          </div>

          {/* Bidding Section */}
          <div className="bid-section">
            <p><strong>Starting Amount:</strong> ₹{product.startingAmount}</p>
            <p><strong>Current Bid:</strong> ₹{currentBid}</p>
            <p><strong>Time Left:</strong> {auctionEnded ? 'Auction Ended' : `${minutesLeft} minutes`}</p>

            <div className="current-bid-button">
              <button disabled>Current Bid: ₹{currentBid}</button>
            </div>

            <input
              type="number"
              placeholder="Enter your bid"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              disabled={auctionEnded || bidLoading}
              aria-label="Enter your bid"
            />
            <button onClick={handleBidSubmit} disabled={auctionEnded || bidLoading}>
              {bidLoading ? 'Placing Bid...' : 'Place Bid'}
            </button>

            {error && <p className="error-message">{error}</p>}
          </div>

          {/* Chat Button */}
          <div className="chat-button">
            <button
              onClick={() => {
                const id = product.createdBy && typeof product.createdBy === 'object'
                  ? product.createdBy._id
                  : product.createdBy;
                setChatWithUserId(id);
                setShowChat(true);
              }}
              aria-label="Open chat with product owner"
            >
              CHAT
            </button>
          </div>
        </div>
      </div>

      {showChat && chatWithUserId && (
        <ChatWindow receiverId={chatWithUserId} onClose={() => setShowChat(false)} />
      )}

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
