import React from 'react';
import './UserHomePage.css';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import OngoingAuctions from '../User/OngoingAuction';
import UpcomingAuctions from '../User/UpcomingAuction';
import SearchHero from '../Common/SearchHero';
import ShowProduct from '../User/ShowProduct';


const UserHomePage = () => {
  return (
    <div className="user-homepage">
      <Header />
      <section className="hero-wrapper">
        <SearchHero />
      </section>
      <main className="auction-section">
  <section id="ongoing-auctions">
    <OngoingAuctions />
  </section>
  <section id="upcoming-auctions">
    <UpcomingAuctions />
  </section>

  <section id="products">
  <ShowProduct />
  </section>
 
</main>

      <Footer />
    </div>
  );
};




export default UserHomePage;
