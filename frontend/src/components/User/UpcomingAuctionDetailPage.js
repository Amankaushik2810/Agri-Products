// src/components/User/UpcomingAuctionDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './OngoingBidDetailPage.css'; // reuse existing styling
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import ChatWindow from '../Chat/ChatWindow';
import { formatToIST } from '../../utils/timeUtils';


const UpcomingAuctionDetailPage = () => {
  const { id } = useParams();
  const [land, setLand] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatWithUserId, setChatWithUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLand = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://agri-products.onrender.com/api/lands/${id}`);
        setLand(res.data);
      } catch (err) {
        setError('Failed to load upcoming land details.');
        console.error('[UpcomingAuctionDetailPage] Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLand();
  }, [id]);

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
                
                alt={`Upcoming Auction ${index}`}
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
            <p><strong>Starting Amount:</strong> ₹{land.startingAmount}</p>
            <p><strong>Auction Start Time:</strong> {formatToIST(land.startTime)}</p>
            <p><strong>Auction End Time:</strong> {formatToIST(land.endTime)}</p>

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

export default UpcomingAuctionDetailPage;
