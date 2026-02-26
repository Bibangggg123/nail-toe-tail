import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for image modal/lightbox functionality
 * @param {Array} images - Array of image objects with id, src, alt
 */
function useImageModal(images) {
  const [modalImage, setModalImage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((image) => {
    setModalImage(image);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setModalImage(null);
    setIsOpen(false);
  }, []);

  const prev = useCallback((e) => {
    if (e) e.stopPropagation();
    setModalImage(current => {
      if (!current) return null;
      const idx = images.findIndex(img => img.id === current.id);
      return images[(idx - 1 + images.length) % images.length];
    });
  }, [images]);

  const next = useCallback((e) => {
    if (e) e.stopPropagation();
    setModalImage(current => {
      if (!current) return null;
      const idx = images.findIndex(img => img.id === current.id);
      return images[(idx + 1) % images.length];
    });
  }, [images]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    };
    
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, close, prev, next]);

  return {
    modalImage,
    isOpen,
    open,
    close,
    prev,
    next,
  };
}

export default useImageModal;
