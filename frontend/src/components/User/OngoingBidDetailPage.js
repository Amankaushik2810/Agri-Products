import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './OngoingBidDetailPage.css';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import ChatWindow from '../Chat/ChatWindow';
import { formatToIST } from '../../utils/timeUtils';

const OngoingBidDetailPage = () => {
  const { id } = useParams();
  const [land, setLand] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [currentBid, setCurrentBid] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatWithUserId, setChatWithUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidLoading, setBidLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLand = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://agri-products.onrender.com/api/lands/${id}`);
        setLand(res.data);
        setCurrentBid(res.data.currentAmount || res.data.startingAmount);
      } catch (err) {
        setError('Failed to load land details.');
        console.error('[OngoingBidDetailPage] Error fetching land details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLand();
  }, [id]);

  const timeLeft = land ? new Date(land.endTime) - new Date() : 0;
  const minutesLeft = Math.floor(timeLeft / 1000 / 60);
  const auctionEnded = minutesLeft <= 0;

  const handleBidSubmit = async () => {
    setError('');
    const bid = parseFloat(bidAmount);

    if (isNaN(bid)) {
      setError("Please enter a valid number for your bid.");
      return;
    }

    if (bid <= currentBid) {
      setError("Please enter a bid higher than the current highest bid.");
      return;
    }

    setBidLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "https://agri-products.onrender.com/api/bids/place",
        { landId: id, bidAmount: bid },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCurrentBid(bid);
      setBidAmount('');
    } catch (err) {
      setError(err.response?.data?.error || "Bid failed");
      console.error('[OngoingBidDetailPage] Bid failed:', err.response?.data || err.message);
    } finally {
      setBidLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!land) return <div>{error || 'No land found.'}</div>;

  return (
    <div>
      <Header />
      <div className="land-detail-container">
        <div className="land-images">
          {Array.isArray(land.images) && land.images.length > 0 ? (
            land.images.map((img, index) => (
              <img
                key={index}
                src={`https://agri-products.onrender.com/uploads/${img}`}
                alt={`Farm ${index}`}
              />
            ))
          ) : (
            <p>No images available</p>
          )}
        </div>

        <div className="land-content">
          <div className="land-info">
            <p><strong>Location:</strong> {land.location}</p>
            <p><strong>Type:</strong> {land.type}</p>
            <p><strong>Description:</strong> {land.description}</p>
          </div>

          <div className="bid-section">
            <p><strong>Starting Amount:</strong> ₹{land.startingAmount}</p>
            <p><strong>Current Bid:</strong> ₹{currentBid}</p>
            <p><strong>End Time:</strong> {formatToIST(land.endTime)}</p>
            <p><strong>Time Left:</strong> {auctionEnded ? 'Auction Ended' : `${minutesLeft} minutes`}</p>


            <div className="current-bid-button">
              <button disabled>Current Bid: ₹{currentBid}</button>
            </div>

            <input
              type="number"
              placeholder="Enter your bid"
              value={bidAmount}
              onChange={e => setBidAmount(e.target.value)}
              disabled={auctionEnded || bidLoading}
              aria-label="Enter your bid"
            />
            <button onClick={handleBidSubmit} disabled={auctionEnded || bidLoading}>
              {bidLoading ? 'Placing Bid...' : 'Place Bid'}
            </button>
            {error && <p className="error-message">{error}</p>}
          </div>

          <div className="chat-button">
          <button
  onClick={() => {
    const id = land.createdBy && typeof land.createdBy === 'object' ? land.createdBy._id : land.createdBy;
    setChatWithUserId(id);
    setShowChat(true);
  }}
  aria-label="Open chat with land owner"
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

export default OngoingBidDetailPage;
