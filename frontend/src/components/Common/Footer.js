import React, { useState } from 'react';
import './Footer.css';

const Footer = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleOpenModal = (type) => {
    if (type === "terms") {
      setModalContent(`
        <h2>Terms & Conditions</h2>
        <p>Welcome to Agri-Product! By accessing or using our platform, you agree to be bound by these terms. Please read carefully before proceeding.</p>
        <ul>
          <li>Users must provide accurate information when listing lands.</li>
          <li>Agri-Product is not responsible for disputes between buyers and sellers.</li>
          <li>Unauthorized activities like fraud may result in account suspension.</li>
        </ul>
      `);
    } else if (type === "contact") {
      setModalContent(`
        <h2>Contact Us</h2>
        <p>Have questions? We'd love to hear from you!</p>
        <ul>
          <li><strong>Email:</strong> agriproductcapstone@gmail.com</li>
          <li><strong>Phone:</strong> +91 74640 20301</li>
          <li><strong>Address:</strong> Muzaffarpur, Bihar, India</li>
        </ul>
      `);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalContent("");
  };

  return (
    <>
      <footer className="footer">
        <div className="footer-logo">AGRI-PRODUCT</div>
        <div className="footer-links">
          <button onClick={() => handleOpenModal("terms")}>Terms & Conditions</button>
          <a href="/about-us">About Us</a>
          <button onClick={() => handleOpenModal("contact")}>Contact Us</button>
        </div>
        <p className="copyright">© 2025 Agri-Product. All rights reserved.</p>
      </footer>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseModal}>&times;</button>
            <div className="modal-body" dangerouslySetInnerHTML={{ __html: modalContent }} />
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
