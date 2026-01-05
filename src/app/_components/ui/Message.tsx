'use client';

import { messageAtom } from "@/atoms/message";
import { useAtom } from "jotai";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const Message = () => {
  const [{ message, error, popup }, setMessage] = useAtom(messageAtom);

  const pathname = usePathname(); // Get the current path

  // Clear message, error, and popup on route change
  useEffect(() => {
    if (message || error || popup) {
      setMessage({message: null})
    }
  }, [pathname]);

  // Automatically hide popup after 5 seconds
  useEffect(() => {
    if (popup === true) {
      const timeout = setTimeout(() => {
        setMessage({message: null})
      }, 5000);

      // Cleanup timeout when popup state changes
      return () => clearTimeout(timeout);
    }
  }, [popup]);

  if (!message) return null;

  return (
    <div
      className={`fixed m-auto left-0 right-0 border-4 z-[99] w-[90vw] xl:w-[30vw] flex flex-col items-center justify-center gap-2 px-5 py-2 font-semibold rounded-sm bg-white/95 dark:bg-black/95 ${
        error
          ? 'border-red-500'
          : 'border-green-500'
      } ${popup ? 'bottom-10' : 'bottom-auto'}`}
    >
      <h1 className="text-xl">{message}</h1>
      {error && <p>Please try again</p>}
    </div>
  );
};

export default Message;
