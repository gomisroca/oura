'use client';

import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type MessageContextType = {
  message: string;
  setMessage: (message: string) => void;
  error?: boolean;
  setError: (error: boolean) => void;
  popup?: boolean;
  setPopup: (popup: boolean) => void;
};

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<boolean>();
  const [popup, setPopup] = useState<boolean>();

  const pathname = usePathname(); // Get the current path

  // Clear message, error, and popup on route change
  useEffect(() => {
    if (message || error || popup) {
      setMessage(''); // Reset message
      setError(false); // Reset error
      setPopup(false); // Reset popup
    }
  }, [pathname, message, error, popup]);

  // Automatically hide popup after 5 seconds
  useEffect(() => {
    if (popup === true) {
      const timeout = setTimeout(() => {
        setMessage('');
        setError(undefined);
        setPopup(undefined);
      }, 5000);

      // Cleanup timeout when popup state changes
      return () => clearTimeout(timeout);
    }
  }, [popup]);

  return (
    <MessageContext.Provider value={{ message, setMessage, error, setError, popup, setPopup }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};
