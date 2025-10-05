// /client/src/pages/About.js
import React from 'react';
import { Container } from 'react-bootstrap'; // Import Container

const About = () => {
  return (
    <Container className="my-5"> {/* Wrap all content in a Container */}
      <div className="glass-card">
        <h2>Our Story</h2>
        <p style={{ lineHeight: '1.8' }}>
          Ethereal Blooms was born from a passion for creating magical, personalized wedding experiences. We believe that every detail matters. Our team combines creative artistry with meticulous planning to ensure your special day is seamless, stress-free, and absolutely stunning. With over a decade of experience in Chennai and beyond, we are dedicated to transforming venues into dreamscapes that reflect your personality and love.
        </p>
      </div>

      <div className="glass-card" style={{ marginTop: '2rem' }}>
        <h2>What We Offer</h2>
        <ul className="services-list">
          <li>Full Wedding Theme Design & Execution</li>
          <li>Custom Stage & Mandap Decoration</li>
          <li>Exquisite Floral Arrangements & Installations</li>
          <li>Ambiance & Mood Lighting Design</li>
          <li>Elegant Guest Seating & Table Decor</li>
          <li>Welcome Gates & Entrance Decoration</li>
        </ul>
      </div>
    </Container>
  );
};

export default About;