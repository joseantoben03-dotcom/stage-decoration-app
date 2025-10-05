// /client/src/pages/Gallery.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion'; // Import motion

const images = [
  '/img1.jpg', '/img2.jpg', '/img3.jpg',
  '/img4.jpg', '/img5.jpg', '/img6.jpg',
  '/img11.jpg', '/img12.jpg', '/img13.jpg',
];

// We can reuse the same animation logic
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

const Gallery = () => {
  const MotionRow = motion(Row);
  const MotionCol = motion(Col);

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4 heading">Our Decorations</h2>
      <MotionRow
        className="g-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {images.map((img, index) => (
          <MotionCol md={6} lg={4} key={index} variants={itemVariants}>
            <div className="gallery-item">
              <img src={img} alt={`Wedding Decor ${index + 1}`} />
            </div>
          </MotionCol>
        ))}
      </MotionRow>
    </Container>
  );
};

export default Gallery;