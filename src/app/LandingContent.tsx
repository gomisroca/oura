import { type Sale } from '@prisma/client';
import { type ProductWithSizes } from 'types';
import Carousel from './_components/ui/Carousel';
import BrowseButton from './BrowseButton';

export default function LandingContent({ sale, products }: { sale?: Sale; products?: ProductWithSizes[] }) {
  return (
    <div className="absolute left-0 right-0 top-0 flex min-h-screen flex-col items-center justify-evenly overflow-hidden">
      {/* Sale Title */}
      <div className="mx-4 mt-6 flex flex-col items-center border-4 border-slate-200 bg-slate-950/20 p-4 md:mx-0 md:mt-0">
        {sale && (
          <h4 className="text-center text-2xl font-bold text-slate-200 drop-shadow-lg [text-shadow:_2px_2px_4px_rgb(0_0_0_/_40%)] md:text-4xl">
            OURA
          </h4>
        )}
        <h1 className="text-center text-5xl font-bold text-slate-200 drop-shadow-lg [text-shadow:_2px_2px_4px_rgb(0_0_0_/_40%)] md:text-7xl">
          {sale ? sale.name.toUpperCase() : 'OURA'}
        </h1>
        <p className="text-center font-bold uppercase text-slate-200 drop-shadow-lg [text-shadow:_2px_2px_4px_rgb(0_0_0_/_40%)]">
          {sale
            ? `${sale.startDate.toLocaleDateString()} - ${sale.endDate.toLocaleDateString()}`
            : 'Sports with a purpose'}
        </p>
      </div>

      {/* Conditional rendering for products and action buttons */}
      {products && products.length > 0 && (
        <div className="flex flex-col items-center justify-center gap-2">
          <BrowseButton sale={sale ? true : false} />
          <Carousel products={products} />
        </div>
      )}
    </div>
  );
}
