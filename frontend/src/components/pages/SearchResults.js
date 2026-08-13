// src/components/User/SearchResults.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import "./SearchResults.css";

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://agri-products.onrender.com/api/land/search?query=${encodeURIComponent(searchQuery)}`
        );
        if (response.status !== 200) {
          throw new Error("Failed to fetch search results");
        }
        setResults(response.data);
        setError(null);
      } catch (err) {
        console.error("Search error:", err);
        setError("Something went wrong while fetching search results.");
      }
      setLoading(false);
    };

    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery]);

  return (
    <div className="search-results-page">
      <Header />
      <div className="search-results">
        <h2 className="section-title">Search Results for "{searchQuery}"</h2>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : results.length === 0 ? (
          <p className="no-results">No results found.</p>
        ) : (
          <div className="auction-cards">
            {results.map((land) => (
              <div key={land._id} className="land-card">
                <img
                  src={land.images && land.images.length > 0
                    ? `https://agri-products.onrender.com/uploads/${land.images[0]}`
                    : "/default-land.jpg"}
                  alt="Land"
                  className="land-image"
                />
                <div className="land-details">
                  <p><strong>Location:</strong> {land.location}</p>
                  <p><strong>Type:</strong> {land.type}</p>
                  <p><strong>Starting Amount:</strong> ₹{land.startingAmount}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;
