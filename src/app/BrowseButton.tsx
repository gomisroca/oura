'use client';

import { useRouter } from 'next/navigation';
import Button from './_components/ui/Button';

function BrowseButton({ sale }: { sale?: boolean }) {
  const router = useRouter();

  const handleBrowse = (route: string) => () => {
    router.push(route);
  };
  return (
    <Button
      name={sale ? 'Browse Sale' : 'Browse Products'}
      onClick={handleBrowse(sale ? '/sale' : '/sport')}
      className="w-[80vw] md:w-[25vw] 2xl:w-[10vw]">
      {sale ? 'Browse Sale' : 'Browse Products'}
    </Button>
  );
}

export default BrowseButton;
