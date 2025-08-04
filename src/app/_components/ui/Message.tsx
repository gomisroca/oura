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
      className={`fixed m-auto left-0 right-0 z-[99] w-[90vw] xl:w-[30vw] flex flex-col items-center justify-center gap-2 px-5 py-2 font-semibold border rounded-sm ${
        error
          ? 'border-red-500 bg-red-200/90 dark:bg-red-800/90'
          : 'border-green-500 bg-green-200/90 dark:bg-green-800/90'
      } ${popup ? 'bottom-10' : 'bottom-auto'}`}
    >
      {/* Conditional Text Based on Error */}
      <p>{error ? "An error occurred" : "Success"}</p>
      <h1 className="text-xl">{message}</h1>
      {error && <p>Please try again</p>}
    </div>
  );
};

export default Message;
