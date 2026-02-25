import React, { useState, useEffect, useCallback } from 'react';
import '../styles/Home.css';

import img1  from '../images/images1.jpg';
import img2  from '../images/images2.jpg';
import img3  from '../images/images3.jpg';
import img4  from '../images/images4.jpg';
import img5  from '../images/images5.jpg';
import img6  from '../images/images6.jpg';
import img7  from '../images/images7.jpg';
import img8  from '../images/images8.jpg';
import img9  from '../images/images9.jpg';
import img10 from '../images/images10.jpg';
import img11 from '../images/images11.jpg';
import img12 from '../images/images12.jpg';
import img13 from '../images/images13.jpg';
import img14 from '../images/images14.jpg';
import img15 from '../images/images15.jpg';
import img16 from '../images/images16.jpg';
import img18 from '../images/images18.jpg';
import img19 from '../images/images19.jpg';

import imgManicure      from '../images/manicure.jpg';
import imgNailDesign    from '../images/nail_design.jpg';
import imgPedicure      from '../images/Pedicure.jpg';
import imgNailArt       from '../images/nailArt.jpg';
import imgNailGel       from '../images/NailGel.jpg';
import imgNailCare      from '../images/nail_care.jpg';
import imgNailExtension from '../images/NailExtension.jpg';
import imgLash          from '../images/lash.jpg';
import imgFootSpa       from '../images/foot_spa.jpg';

const nailDesignImages = [
  { id: 1,  src: img1,  alt: 'Nail Design 1' },
  { id: 2,  src: img2,  alt: 'Nail Design 2' },
  { id: 3,  src: img3,  alt: 'Nail Design 3' },
  { id: 4,  src: img4,  alt: 'Nail Design 4' },
  { id: 5,  src: img5,  alt: 'Nail Design 5' },
  { id: 6,  src: img6,  alt: 'Nail Design 6' },
  { id: 7,  src: img7,  alt: 'Nail Design 7' },
  { id: 8,  src: img8,  alt: 'Nail Design 8' },
  { id: 9,  src: img9,  alt: 'Nail Design 9' },
  { id: 10, src: img10, alt: 'Nail Design 10' },
  { id: 11, src: img11, alt: 'Nail Design 11' },
  { id: 12, src: img12, alt: 'Nail Design 12' },
  { id: 13, src: img13, alt: 'Nail Design 13' },
  { id: 14, src: img14, alt: 'Nail Design 14' },
  { id: 15, src: img15, alt: 'Nail Design 15' },
  { id: 16, src: img16, alt: 'Nail Design 16' },
];

const teamPreview = [
  {
    name:        'Rose',
    role:        'Senior Nail & Beauty Specialist',
    rating:      4.8,
    reviews:     245,
    image:       img18,
    specialties: ['Nail Design', 'Gel Nails', 'Lash Extension', 'Waxing'],
  },
  {
    name:        'Pangging',
    role:        'Beauty & Spa Specialist',
    rating:      4.9,
    reviews:     280,
    image:       img19,
    specialties: ['Pedicure', 'Lash Firm', 'Foot Spa', 'Complete Care'],
  },
];

const serviceCards = [
  { icon: '', title: 'Nail Design',     description: 'Beautiful custom nail art designs',     image: imgNailDesign    },
  { icon: '', title: 'Manicure',        description: 'Professional manicure services',         image: imgManicure      },
  { icon: '', title: 'Pedicure',        description: 'Relaxing pedicure treatment',            image: imgPedicure      },
  { icon: '', title: 'Nail Art',        description: 'Creative and trendy nail designs',       image: imgNailArt       },
  { icon: '', title: 'Gel Nails',       description: 'Long-lasting gel nail polish',           image: imgNailGel       },
  { icon: '', title: 'Nail Care',       description: 'Health and maintenance services',        image: imgNailCare      },
  { icon: '', title: 'Nail Extensions', description: 'Beautiful nail length and shape',        image: imgNailExtension },
  { icon: '', title: 'Lash Services',   description: 'Extensions and lash lift treatments',    image: imgLash          },
  { icon: '', title: 'Foot Spa',        description: 'Full relaxing foot spa experience',      image: imgFootSpa       },
];

function Home({ setCurrentPage }) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [modalImage,    setModalImage]    = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const visibleCount = 5;
  const maxIndex     = nailDesignImages.length - visibleCount;

  const nextSlide = useCallback(() => {
    setCarouselIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = () => {
    setCarouselIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    if (!isAutoPlaying || modalImage) return;
    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, modalImage, nextSlide]);

  const openModal = (image) => {
    setModalImage(image);
    setIsAutoPlaying(false);
  };

  const closeModal = () => {
    setModalImage(null);
    setIsAutoPlaying(true);
  };

  const modalPrev = useCallback((e) => {
    if (e) e.stopPropagation();
    setModalImage(prev => {
      const idx = nailDesignImages.findIndex(img => img.id === prev.id);
      return nailDesignImages[(idx - 1 + nailDesignImages.length) % nailDesignImages.length];
    });
  }, []);

  const modalNext = useCallback((e) => {
    if (e) e.stopPropagation();
    setModalImage(prev => {
      const idx = nailDesignImages.findIndex(img => img.id === prev.id);
      return nailDesignImages[(idx + 1) % nailDesignImages.length];
    });
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (!modalImage) return;
      if (e.key === 'Escape')     closeModal();
      if (e.key === 'ArrowLeft')  modalPrev();
      if (e.key === 'ArrowRight') modalNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [modalImage, modalPrev, modalNext]);

  return (
    <div className="home">

      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Nail-Toe-Tail</h1>
          <p>Premium Nail Care Services for You</p>
          <button className="btn btn-primary hero-btn" onClick={() => setCurrentPage('booking')}>
            Book Your Appointment
          </button>
        </div>
      </section>

      <section className="services-preview">
        <h2>Our Services</h2>
        <div className="services-grid-3x3">
          {serviceCards.map((svc, i) => (
            <ServiceCard
              key={i}
              icon={svc.icon}
              title={svc.title}
              description={svc.description}
              image={svc.image}
            />
          ))}
        </div>
      </section>

      <section className="carousel-section">
        <h2>Nail Design Gallery</h2>
        <p className="carousel-subtitle">Click any image to preview</p>
        <div className="carousel-wrapper">
          <button className="carousel-btn" onClick={prevSlide} aria-label="Previous">&#8249;</button>
          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${carouselIndex * (100 / visibleCount)}%)` }}
            >
              {nailDesignImages.map(img => (
                <div
                  key={img.id}
                  className="carousel-slide"
                  style={{ width: `${100 / visibleCount}%` }}
                  onClick={() => openModal(img)}
                >
                  <img src={img.src} alt={img.alt} />
                  <div className="carousel-overlay">
                    <span className="zoom-icon">🔍</span>
                    <span className="img-label">{img.alt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="carousel-btn" onClick={nextSlide} aria-label="Next">&#8250;</button>
        </div>
        <div className="carousel-dots">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              className={`dot ${carouselIndex === i ? 'active' : ''}`}
              onClick={() => setCarouselIndex(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {modalImage && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>
            <button className="modal-nav modal-nav-prev" onClick={modalPrev}>&#8249;</button>
            <img src={modalImage.src} alt={modalImage.alt} className="modal-image" />
            <button className="modal-nav modal-nav-next" onClick={modalNext}>&#8250;</button>
            <p className="modal-caption">{modalImage.alt}</p>
          </div>
        </div>
      )}

      <section className="team-preview">
        <h2>Meet Our Specialists</h2>
        <div className="team-grid">
          {teamPreview.map(member => (
            <TeamCard
              key={member.name}
              name={member.name}
              role={member.role}
              rating={member.rating}
              reviews={member.reviews}
              image={member.image}
              specialties={member.specialties}
              onBook={() => setCurrentPage('booking')}
            />
          ))}
        </div>
        <button className="btn btn-secondary" onClick={() => setCurrentPage('team')}>
          View All Team Members
        </button>
      </section>

      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <Feature icon="⭐" title="Expert Specialists" desc="Trained professionals with years of experience" />
          <Feature icon="💎" title="Premium Quality"    desc="Using only the best products and materials" />
          <Feature icon="🕐" title="Easy Booking"       desc="Simple online appointment scheduling" />
          <Feature icon="😊" title="Customer Care"      desc="Your satisfaction is our priority" />
        </div>
      </section>

      <section className="cta">
        <h2>Ready for Beautiful Nails?</h2>
        <button className="btn btn-primary" onClick={() => setCurrentPage('booking')}>
          Schedule Now
        </button>
      </section>

    </div>
  );
}

function ServiceCard({ icon, title, description, image }) {
  return (
    <div className="service-card">
      <div className="service-card-img-wrapper">
        <img src={image} alt={title} className="service-card-img" />
        <div className="service-card-img-overlay" />
      </div>
      <div className="service-card-body">
        <div className="service-icon">{icon}</div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function TeamCard({ name, role, rating, reviews, image, specialties, onBook }) {
  return (
    <div className="team-card-preview">
      <div className="team-photo-wrapper">
        <img src={image} alt={name} className="team-photo" />
      </div>
      <h3>{name}</h3>
      <p className="team-role">{role}</p>
      <div className="rating">
        {'⭐'.repeat(Math.floor(rating))}
        <span className="rating-num">{rating}</span>
        <span className="rating-reviews">({reviews} reviews)</span>
      </div>
      <div className="team-specialties">
        {specialties.map((s, i) => (
          <span key={i} className="team-spec-tag">{s}</span>
        ))}
      </div>
      <button className="btn btn-primary team-book-btn" onClick={onBook}>
        Book with {name}
      </button>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="feature-box">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

export default Home;