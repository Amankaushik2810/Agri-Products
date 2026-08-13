import React, { useEffect, useState } from 'react';
import './AuctionCard.css';
import { useNavigate } from 'react-router-dom';

const AuctionCard = ({
  id,
  image,
  location,
  type,
  startingAmount,
  currentAmount,
  cardType = 'land',
  startTime, // Pass the auction start time as prop
}) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (cardType === 'upcoming' && startTime) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const start = new Date(startTime).getTime();
        const distance = start - now;

        if (distance <= 0) {
          clearInterval(interval);
          setCountdown('Auction starting soon!');
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [cardType, startTime]);

  const handleCardClick = () => {
    if (cardType === 'product') {
      navigate(`/product/${id}`);
    } else if (cardType === 'upcoming') {
      navigate(`/upcoming-auction/${id}`);
    } else {
      navigate(`/ongoing-bid/${id}`);
    }
  };

  return (
    <div className="auction-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      {cardType === 'upcoming' && <div className="ribbon">Coming Soon</div>}
      <img src={image} alt="Auction item" className="auction-img" />
      <div className="auction-details">
        <p><strong>Location:</strong> {location}</p>
        {/* <p><strong>Type:</strong> {type}</p> */}
        <p><strong>Starting Amount:</strong> {startingAmount}</p>
        <p><strong>{currentAmount.includes('Starts') ? 'Start Time' : 'Current Amount'}:</strong> {currentAmount}</p>
        {cardType === 'upcoming' && <p className="countdown"><strong>Time Left:</strong> {countdown}</p>}
      </div>
    </div>
  );
};

export default AuctionCard;
