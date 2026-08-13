import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WonLandBidCard from './WonLandBidCard';
import './MyWins.css';
import Header from '../Common/Header';
import Footer from '../Common/Footer';

const MyWins = () => {
  const [wonLands, setWonLands] = useState([]);

  useEffect(() => {
    const fetchWonLands = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://agri-products.onrender.com/api/bids/won-lands', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWonLands(response.data);
      } catch (error) {
        console.error('Error fetching my wins:', error);
      }
    };

    fetchWonLands();
  }, []);

  return (
    <>
      <Header />
      <div className="won-bids-page">
        <h2>🏆 My Won Land Bids</h2>
        {wonLands.length > 0 ? (
          wonLands.map((land) => (
            <WonLandBidCard key={land._id} land={land} />
          ))
        ) : (
          <p>No won bids yet.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyWins;
