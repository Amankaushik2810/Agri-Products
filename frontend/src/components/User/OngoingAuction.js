// src/components/User/OngoingAuctions.js
import React, { useEffect, useState } from 'react';
import AuctionCard from './AuctionCard';
import './OngoingAuctions.css';

const OngoingAuctions = () => {
  const [ongoingLands, setOngoingLands] = useState([]);

  useEffect(() => {
    const fetchLands = async () => {
      try {
        const response = await fetch('https://agri-products.onrender.com/api/land');
        const data = await response.json();
        setOngoingLands(data.ongoing);
      } catch (error) {
        console.error('Error fetching ongoing lands:', error);
      }
    };

    fetchLands();
  }, []);

  const getCurrentBidAmount = (bids = []) => {
    if (bids.length === 0) return 'No bids yet';
    const sortedBids = [...bids].sort((a, b) => b.bidAmount - a.bidAmount);
    return `₹${sortedBids[0].bidAmount}`;
  };

  return (
    <div className="ongoing-auctions">
      <h2 className="section-title">On-going Auctions</h2>
      <div className="auction-cards">
        {ongoingLands.length > 0 ? (
          ongoingLands.map((land) => (
            <AuctionCard
              key={land._id}
              id={land._id}
              image={`https://agri-products.onrender.com/uploads/${land.images[0]}`}
              location={land.location}
              type={land.type}
              startingAmount={`₹${land.startingAmount}`}
              currentAmount={`₹${land.currentAmount}`}
              cardType="land"
            />
          ))
        ) : (
          <p>No ongoing auctions right now.</p>
        )}
      </div>
    </div>
  );
};

export default OngoingAuctions;
