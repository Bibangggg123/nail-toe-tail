import React from 'react';
import '../styles/Home.css';

// Data
import { nailDesignImages, teamPreview, serviceCards } from '../data/images';

// Components
import ServiceCard from '../components/ServiceCard';
import TeamCard from '../components/TeamCard';
import Feature from '../components/Feature';

// Hooks
import useCarousel from '../hooks/useCarousel';
import useImageModal from '../hooks/useImageModal';

// Constants
const VISIBLE_COUNT = 5;
const AUTO_PLAY_INTERVAL = 3000;

function Home({ setCurrentPage }) {
  // Custom hooks for carousel and modal
  const modal = useImageModal(nailDesignImages);

  // Carousel with auto-pause when modal is open
  const carousel = useCarousel(
    nailDesignImages.length,
    VISIBLE_COUNT,
    AUTO_PLAY_INTERVAL,
    modal.isOpen
  );

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
        <div className="services-header-clickable" onClick={() => setCurrentPage('services')}>
          <h2>Our Services</h2>
        </div>
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
        <div className="carousel-header-clickable" onClick={() => setCurrentPage('gallery')}>
          <h2>Nail Design Gallery</h2>
          <p className="carousel-subtitle">Click any image to preview • <span className="view-all-link">View All Designs →</span></p>
        </div>
        <div className="carousel-wrapper">
          <button className="carousel-btn" onClick={carousel.prev} aria-label="Previous">&#8249;</button>
          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${carousel.currentIndex * (100 / VISIBLE_COUNT)}%)` }}
            >
              {nailDesignImages.map(img => (
                <div
                  key={img.id}
                  className="carousel-slide"
                  style={{ width: `${100 / VISIBLE_COUNT}%` }}
                  onClick={() => modal.open(img)}
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
          <button className="carousel-btn" onClick={carousel.next} aria-label="Next">&#8250;</button>
        </div>
        <div className="carousel-dots">
          {Array.from({ length: carousel.maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              className={`dot ${carousel.currentIndex === i ? 'active' : ''}`}
              onClick={() => carousel.goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {modal.isOpen && modal.modalImage && (
        <div className="modal-backdrop" onClick={modal.close}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={modal.close}>✕</button>
            <button className="modal-nav modal-nav-prev" onClick={modal.prev}>&#8249;</button>
            <img src={modal.modalImage.src} alt={modal.modalImage.alt} className="modal-image" />
            <button className="modal-nav modal-nav-next" onClick={modal.next}>&#8250;</button>
            <p className="modal-caption">{modal.modalImage.alt}</p>
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

export default Home;