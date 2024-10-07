'use client';

import React, { useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'
import { ProductWithSizes } from 'types';
import ProductCard from '../product/ProductCard';

export default function Carousel({ products }: { products: ProductWithSizes[] }) {
  const [emblaRef] = useEmblaCarousel({ align: 'center' }, [Autoplay({ stopOnMouseEnter: true, stopOnInteraction: false }), Fade()])

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex overflow-hidden">
        {products.map((product, index) => (
          <div key={index} className="flex-[0_0_100%] min-w-0 flex items-center justify-center">
            <ProductCard product={product} className='h-[15rem] w-[80vw] sm:h-[20rem] md:h-[25rem] md:w-[20rem]' />
          </div>
        ))}
      </div>
    </div>
  )
}
