import React from 'react';
import './Header.css';

const Header = () => (
  <header className="header">
    <div className="logo">
      <span className="logo-green">AGRI</span>PRODUCT
    </div>
    <nav className="nav-links">
      <a href="/user">Home</a>
      <a href="#ongoing-auctions">On-going Auctions</a>
      <a href="#upcoming-auctions">Upcoming Auctions</a>
      <a href="/about-us">About Us</a>
      <a href="/dashboard">Dashboard</a>
      <a href="/owner/chat-inbox">Chats</a>
    </nav>
  </header>
);

export default Header;
