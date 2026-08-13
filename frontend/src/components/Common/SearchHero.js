import React, { useState } from "react";
import "./SearchHero.css";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import plantImage from "../../assets/plant.png"; // Add this import ✅

const SearchHero = () => {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const handleListLandClick = () => {
    navigate("/list-land");
  };

  const handleListProductClick = () => {
    navigate("/list-product"); // Redirect to the product listing form page
  };

  const handleSearch = () => {
    if (searchInput.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search-hero-container">
      {/* Add Plant Images */}
      <img src={plantImage} alt="Plant Left" className="plant-image left" />
      <img src={plantImage} alt="Plant Right" className="plant-image right" />

      <div className="hero-button">
        {/* List Your Land Button */}
        <button className="list-land-btn" onClick={handleListLandClick}>
          List Your Land
        </button>

        {/* List Product Button */}
        <button id="productbtn" className="list-land-btn" onClick={handleListProductClick}>
          List Product
        </button>
      </div>

      <div className="hero-content">
        <h1>
          Bid <span className="highlight">Smarter.</span>
          <br />
          Grow <span className="highlight">Greener.</span>
        </h1>

        <div className="search-bar">
          <div className="icon-container">
            <Search size={16} className="search-icon" />
          </div>

          <input
            type="text"
            placeholder="Search by location, type..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchHero;
