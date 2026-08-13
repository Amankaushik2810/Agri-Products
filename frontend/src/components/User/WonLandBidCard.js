import React from 'react';
import './WonLandBidCard.css';

const WonLandBidCard = ({ land }) => {
  const {
    location,
    type,
    startingAmount,
    finalBidAmount,
    startTime,
    endTime,
    images = [],
    pdfFile,
    completedAt,
  } = land;

  const formatDateTime = (dateString) =>
    dateString ? new Date(dateString).toLocaleString() : 'N/A';

  const getImageUrl = (imgPath) =>
    `https://agri-products.onrender.com/uploads/${imgPath}`;

  return (
    <div className="won-land-card">
      <div className="won-land-image-container">
        {images.length > 0 ? (
          <img
            src={getImageUrl(images[0])}
            alt="Land"
            className="single-land-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/400x200?text=Image+Not+Found";
            }}
          />
        ) : (
          <img
            src="https://via.placeholder.com/400x200?text=No+Image"
            alt="No land"
            className="single-land-image"
          />
        )}
      </div>

      <div className="won-land-details">
        <h3>{location} - {type}</h3>
        <p><strong>Starting Amount:</strong> ₹{startingAmount}</p>
        <p><strong>Final Bid Amount:</strong> ₹{finalBidAmount}</p>
        <p><strong>Bid Duration:</strong></p>
        <p>🕒 {formatDateTime(startTime)} ➡️ {formatDateTime(endTime)}</p>
        <p><strong>Status:</strong> <span className="status-completed">Completed</span></p>
        <p><strong>Completed At:</strong> {formatDateTime(completedAt)}</p>

        {pdfFile ? (
          <a
            href={`https://agri-products.onrender.com/pdfs/${pdfFile}`}
            target="_blank"
            rel="noopener noreferrer"
            className="pdf-download-btn"
          >
            📄 Download Certificate
          </a>
        ) : (
          <p className="pdf-unavailable">📄 Certificate not available</p>
        )}
      </div>
    </div>
  );
};

export default WonLandBidCard;
