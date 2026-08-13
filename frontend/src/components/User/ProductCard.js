// src/components/User/ProductCard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://agri-products.onrender.com/api/products/paginated', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await res.json();
        const now = new Date();

        // Filter only valid (non-expired) products
        const validProducts = data.products.filter(product => new Date(product.endTime) > now);

        setProducts(validProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="product-list">
      <h2>Active Product Auctions</h2>
      {products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product._id} onClick={() => handleClick(product._id)}>
              <img src={`https://agri-products.onrender.com/uploads/${product.images[0]}`} alt={product.name} />
              <h3>{product.name || product.location}</h3>
              <p>{product.description.slice(0, 50)}...</p>
              <p>Starting Bid: ₹{product.startingAmount}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No valid products available at the moment.</p>
      )}
    </div>
  );
};

export default ProductCard;
