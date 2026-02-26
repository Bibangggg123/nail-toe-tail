import React, { useState } from 'react';
import { nailDesignImages } from '../data/images';
import '../styles/Gallery.css';

function Gallery({ setCurrentPage }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => setSelectedImage(image);
  const closeModal = () => setSelectedImage(null);

  const navigateImage = (direction) => {
    if (!selectedImage) return;
    const currentIndex = nailDesignImages.findIndex(img => img.id === selectedImage.id);
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % nailDesignImages.length
      : (currentIndex - 1 + nailDesignImages.length) % nailDesignImages.length;
    setSelectedImage(nailDesignImages[newIndex]);
  };

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <button className="back-btn" onClick={() => setCurrentPage('home')}>
          ← Back to Home
        </button>
        <h1>Nail Design Gallery</h1>
        <p>Browse our collection of {nailDesignImages.length} beautiful nail designs</p>
      </div>

      <div className="gallery-grid">
        {nailDesignImages.map(img => (
          <div
            key={img.id}
            className="gallery-item"
            onClick={() => openModal(img)}
          >
            <img src={img.src} alt={img.alt} />
            <div className="gallery-item-overlay">
              <span className="zoom-icon">🔍</span>
              <span className="gallery-item-label">{img.alt}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="gallery-modal-backdrop" onClick={closeModal}>
          <div className="gallery-modal-content" onClick={e => e.stopPropagation()}>
            <button className="gallery-modal-close" onClick={closeModal}>✕</button>
            <button className="gallery-modal-nav gallery-modal-prev" onClick={() => navigateImage('prev')}>
              &#8249;
            </button>
            <img src={selectedImage.src} alt={selectedImage.alt} className="gallery-modal-image" />
            <button className="gallery-modal-nav gallery-modal-next" onClick={() => navigateImage('next')}>
              &#8250;
            </button>
            <p className="gallery-modal-caption">{selectedImage.alt}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
