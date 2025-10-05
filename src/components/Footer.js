import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <Container>
        <Row>
          {/* Column 1: About */}
          <Col md={4} className="footer-col">
            <h5>Ethereal Blooms</h5>
            <p>
              Creating magical moments that bloom into cherished memories. 
              Your trusted partner in bringing dream events to life.
            </p>
            <div className="social-icons">
              <a href={`https://wa.me/919003857716`} target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
              <a href="https://instagram.com/elite_warrior.r" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              {/* Updated mailto link */}
              <a href="mailto:seyadriyaz0@gmail.com"><FiMail /></a>
            </div>
          </Col>

          {/* Column 2: Quick Links */}
          <Col md={4} className="footer-col">
            <h5>Quick Links</h5>
            <ul className="footer-links">
              <li><LinkContainer to="/"><a href="/">Home</a></LinkContainer></li>
              <li><LinkContainer to="/gallery"><a href="/gallery">Our Art Works</a></LinkContainer></li>
              {/* Updated link text */}
              <li><LinkContainer to="/about"><a href="/about">About Ethereal Blooms</a></LinkContainer></li>
              {/* Updated link text */}
              <li><LinkContainer to="/contact"><a href="/contact">Contact Ethereal Blooms</a></LinkContainer></li>
            </ul>
          </Col>

          {/* Column 3: Contact Info */}
          <Col md={4} className="footer-col">
            <h5>Contact Info</h5>
            <ul className="contact-list">
              <li>
                <a href="tel:+919003857716">
                  <FiPhone className="icon" /> +91 90038 57716
                </a>
              </li>
              {/* Updated clickable mailto link */}
              <li>
                <a href="mailto:seyadriyaz0@gmail.com">
                  <FiMail className="icon" /> seyadriyaz0@gmail.com
                </a>
              </li>
              {/* Updated location */}
              <li><FiMapPin className="icon" /> Tirunelveli, Tamil Nadu</li>
            </ul>
          </Col>
        </Row>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Ethereal Blooms. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

