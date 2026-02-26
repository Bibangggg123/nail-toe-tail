import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for carousel functionality
 * @param {number} totalItems - Total number of items in carousel
 * @param {number} visibleCount - Number of visible items at once
 * @param {number} autoPlayInterval - Auto-play interval in ms (0 to disable)
 * @param {boolean} pauseAutoPlay - Whether to pause auto-play
 */
function useCarousel(totalItems, visibleCount = 5, autoPlayInterval = 3000, pauseAutoPlay = false) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = totalItems - visibleCount;

  const next = useCallback(() => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const goTo = useCallback((index) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  }, [maxIndex]);

  // Auto-play effect
  useEffect(() => {
    if (!autoPlayInterval || pauseAutoPlay) return;
    
    const timer = setInterval(next, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlayInterval, pauseAutoPlay, next]);

  return {
    currentIndex,
    maxIndex,
    next,
    prev,
    goTo,
    visibleCount,
  };
}

export default useCarousel;
