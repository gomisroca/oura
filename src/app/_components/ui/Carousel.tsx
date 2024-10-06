'use client';

import React, { useEffect, useState } from 'react';
import { ProductWithSizes } from 'types';
import ProductCard from '../product/ProductCard';
import Button from './Button';

const Carousel = ({ products }: { products: ProductWithSizes[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovering, setHovering] = useState(false);

  setTimeout(() => {
    if(hovering) return;
    setCurrentIndex((currentIndex + 1) % products.length);
  }, 3000);

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % products.length);
  };

  const handlePrev = () => {
    setCurrentIndex((currentIndex - 1 + products.length) % products.length);
  };

  const handleMouseEnter = () => {
    setHovering(true);
  };

  const handleMouseLeave = () => {
    setHovering(false);
  };

  return (
    <div 
    className="relative"
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    >
      <div className="relative overflow-hidden flex-row flex">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`${index === currentIndex ? 'active' : 'hidden'}`}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      <Button
        className="absolute top-10 left-0 z-10"
        onClick={handlePrev}
      >
        &#10094;
      </Button>
      <Button
        className="absolute top-10 right-0 z-10"
        onClick={handleNext}
      >
        &#10095;
      </Button>
    </div>
  );
};

export default Carousel;