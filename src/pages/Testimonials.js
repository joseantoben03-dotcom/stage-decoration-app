import React from 'react';
import { Container } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import './Testimonials.css';

// Dummy testimonials
const reviews = [
  {
    id: 1,
    quote: "Absolutely amazing! They turned our vision into reality with flawless execution.",
    name: "Elegant Events",
    event: "Beach Wedding"
  },
  {
    id: 2,
    quote: "The flowers were magical, and every detail was perfect. Highly recommended!",
    name: "Bloom & Bliss",
    event: "Indoor Luxury Wedding"
  },
  {
    id: 3,
    quote: "The ambiance was incredible. Our guests couldn’t stop complimenting the setup.",
    name: "Luxe Light Co.",
    event: "Night Wedding"
  },
  {
    id: 4,
    quote: "They managed everything flawlessly. We felt completely stress-free throughout the event!",
    name: "Grand Celebration Planners",
    event: "Destination Wedding"
  },
  {
    id: 5,
    quote: "Our small wedding felt magical and luxurious. Truly unforgettable!",
    name: "Pure Elegance Designs",
    event: "Intimate Wedding"
  }
];

const Testimonials = () => {
  return (
    <div className="testimonials-section">
      <Container>
        <h2 className="text-center mb-4">What Our Clients Say</h2>
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Pagination, Navigation, Autoplay]}
          className="mySwiper"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="testimonial-content text-center p-4">
                <p className="quote">"{review.quote}"</p>
                <p className="author">- {review.name}, {review.event}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </div>
  );
};

export default Testimonials;
