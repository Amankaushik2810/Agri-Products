// ShowProduct.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AuctionCard from './AuctionCard';
import './OngoingAuctions.css';

const ShowProduct = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 4;

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`https://agri-products.onrender.com/api/products/paginated?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newProducts = res.data.products;

      setProducts((prev) => {
        const existingIds = new Set(prev.map(p => p._id));
        const uniqueProducts = [
          ...prev,
          ...newProducts.filter(p => !existingIds.has(p._id)),
        ];
        return uniqueProducts;
      });

      setHasMore(res.data.hasMore);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  return (
    <div className="ongoing-auctions">
      <h2 className="section-title">Listed Products</h2>
      <div className="auction-cards">
        {products.map((product) => (
          <AuctionCard
            key={product._id}
            id={product._id}
            image={`https://agri-products.onrender.com/${product.images[0]}`}
            location={product.location}
            startingAmount={`₹${product.startingAmount}`}
            currentAmount={`₹${product.currentAmount}`}
            cardType="product" // <-- Important: tells the card to go to product route
          />
        ))}
      </div>

      {hasMore ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button className="load-more-btn" onClick={() => setPage((prevPage) => prevPage + 1)}>
            Show More
          </button>
        </div>
      ) : (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          <b>Yay! You have seen all the listed products.</b>
        </p>
      )}
    </div>
  );
};

export default ShowProduct;
