// src/components/User/UpcomingAuctions.js
import React, { useEffect, useState } from 'react';
import AuctionCard from './AuctionCard';
import './UpcomingAuctions.css';
import { formatToIST } from '../../utils/timeUtils';

const UpcomingAuctions = () => {
  const [upcomingLands, setUpcomingLands] = useState([]);

  useEffect(() => {
    const fetchLands = async () => {
      try {
        const response = await fetch('https://agri-products.onrender.com/api/land');
        const data = await response.json();
        setUpcomingLands(data.upcoming);
      } catch (error) {
        console.error('Error fetching upcoming lands:', error);
      }
    };

    fetchLands();
  }, []);

  return (
    <div className="upcoming-auctions">
      <h2 className="section-title">Upcoming Auctions</h2>
      <div className="auction-cards">
        {upcomingLands.length > 0 ? (
          upcomingLands.map((land) => (
            <AuctionCard
  key={land._id}
  id={land._id}
  image={`https://agri-products.onrender.com/uploads/${land.images[0]}`}
  location={land.location}
  type={land.type}
  startingAmount={`₹${land.startingAmount}`}
  currentAmount={`Starts on ${formatToIST(land.startTime)}`}
  cardType="upcoming"
  startTime={land.startTime}
/>


          ))
        ) : (
          <p>No upcoming auctions found.</p>
        )}
      </div>
    </div>
  );
};

export default UpcomingAuctions;