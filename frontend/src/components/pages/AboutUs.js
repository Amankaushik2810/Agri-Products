import React from 'react';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <Header />
      <main className="about-us-content">
        <section className="hero-section">
          <h1>About Agri-Product</h1>
          <p>Empowering Farmers. Connecting Landowners. Simplifying Auctions.</p>
        </section>

        <section className="info-section">
          <h2>Our Mission</h2>
          <p>
            At Agri-Product, we aim to create a seamless digital platform that connects
            landowners and farmers through transparent and efficient auctioning of agricultural land.
            We are committed to empowering users with the tools they need to make informed decisions.
          </p>
        </section>

        <section className="info-section">
          <h2>Why Choose Us?</h2>
          <ul>
            <li>🚜 Easy-to-use platform for land auctions</li>
            <li>🔒 Secure and verified listings</li>
            <li>🕒 Real-time updates on ongoing and upcoming auctions</li>
            <li>🌱 Supporting sustainable agriculture and farmer empowerment</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
