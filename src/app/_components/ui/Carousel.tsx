'use client';

import { useState, useEffect, useRef } from 'react';
import { ProductWithSizes } from 'types';
import ProductCard from '../product/ProductCard';

export default function Carousel({ products, sportListView = false }: { products: ProductWithSizes[], sportListView?: Boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to change the current product
  const nextProduct = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  // Start autoplay when component mounts
  useEffect(() => {
    startAutoplay();

    return () => {
      stopAutoplay(); // Clean up the interval on unmount
    };
  }, []);

  // Start the autoplay with an interval
  const startAutoplay = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(nextProduct, 5000); // Change every 3 seconds
    }
  };

  // Stop the autoplay
  const stopAutoplay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Handle touch and mouse events to control autoplay
  const handleInteractionStart = () => stopAutoplay();
  const handleInteractionEnd = () => startAutoplay();
  
  return (
    <div
      className="overflow-hidden"
      onMouseEnter={handleInteractionStart} // Desktop hover: stop autoplay
      onMouseLeave={handleInteractionEnd}   // Desktop hover out: resume autoplay
      onTouchStart={handleInteractionStart} // Mobile touch: stop autoplay
      onTouchEnd={handleInteractionEnd}     // Mobile touch end: resume autoplay
    >
      <div className="flex items-center justify-center">
        {products[currentIndex] && (
        <ProductCard
          product={products[currentIndex]}
          loadingMethod="eager"
          className={sportListView && 'pointer-events-none'}
        />)}
      </div>
    </div>
  );
}
