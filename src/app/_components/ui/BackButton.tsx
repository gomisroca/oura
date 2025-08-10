'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function BackButton({ children, steps = -1 }: { children: React.ReactNode; steps?: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); 

  const goBack = () => {
    // Split the current pathname into segments
    const pathSegments = pathname.split('/').filter(Boolean); // removes any empty segments

    if (pathSegments.length > 1) {
      // Remove the last segment of the path
      const newPath = '/' + pathSegments.slice(0, steps).join('/');

      
      const searchString = searchParams.toString();
      const fullPath = searchString ? `${newPath}?${searchString}` : newPath;

      router.push(fullPath); // Navigate to the modified path
    } else {
      // Handle case where there's only one segment (root) or another edge case
      router.push('/');
    }
  };

  return (
    <div onClick={goBack} className='flex flex-row items-center justify-center text-sm uppercase group cursor-pointer mr-2'>
      <span className='group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors duration-200'>{children}</span>
      <span className='pl-1'>/</span>
    </div>
  );
}

export default BackButton;
