import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import Testimonials from './Testimonials';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';

// Your services array remains the same
const services = [
  {
    title: "Thematic Decor",
    shortDescription: "We design and execute stunning themes that bring your wedding vision to life, from classic elegance to modern chic.",
    image: "/img8.jpg",
    description: "Every love story is unique, and so your wedding theme should be too. We specialize in creating cohesive, immersive environments."
  },
  {
    title: "Floral Artistry",
    shortDescription: "Our team creates magical floral arrangements, centerpieces, and bouquets that add a touch of nature's beauty.",
    image: "/img9.jpg",
    description: "From grand archways to delicate table settings, we use the freshest blooms to craft breathtaking floral masterpieces."
  },
  {
    title: "Lighting & Ambiance",
    shortDescription: "We use professional lighting to create the perfect mood and transform any venue into a dreamscape.",
    image: "/img10.jpg",
    description: "The right light sets the perfect mood. We design custom lighting schemes that make every moment absolutely magical."
  }
];

// Animation variants for the container (Row) to orchestrate animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2 // This will make each child animate 0.2s after the previous one
    }
  }
};

// Animation variants for the items (Col)
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

const Home = () => {
  const [modalContent, setModalContent] = useState(null);
  const openModal = (service) => setModalContent(service);
  const closeModal = () => setModalContent(null);

  // Convert Row and Col to motion components
  const MotionRow = motion(Row);
  const MotionCol = motion(Col);

  return (
    <div className="home-background">
      <Container className="text-center glass-card my-5">
        <h1>Crafting Unforgettable Moments</h1>
        <p className="lead my-4">
           From dreamy florals to breathtaking stages, we design weddings that tell your unique love story.
        </p>
        <Button as={Link} to="/contact" variant="primary" className="btn-custom">Plan Your Dream Day</Button>
      </Container>

      <Container className="services-section my-5">
        <h2 className="text-center heading">Our Core Services</h2>
        <MotionRow
          className="g-4 mt-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible" // Triggers the animation when the element is in view
          viewport={{ once: true, amount: 0.2 }} // `once: true` ensures it only animates once
        >
          {services.map((service, index) => (
            <MotionCol md={6} lg={4} key={index} variants={itemVariants}>
              <Card className="service-card h-100" onClick={() => openModal(service)}>
                <Card.Img variant="top" src={service.image} className="service-card-image" />
                <Card.Body>
                  <Card.Title as="h3">{service.title}</Card.Title>
                  <Card.Text>{service.shortDescription}</Card.Text>
                </Card.Body>
              </Card>
            </MotionCol>
          ))}
        </MotionRow>
      </Container>
      
      <Testimonials />
      
      <Modal content={modalContent} onClose={closeModal} />
    </div>
  );
};

export default Home;

