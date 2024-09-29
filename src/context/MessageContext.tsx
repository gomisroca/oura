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

  // Clear message on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setMessage(''); // Reset message
      setError(false); // Reset error if needed
      setPopup(false); // Reset popup if needed
    };

    // Listen for route changes
    if (popup === false && pathname) {
      handleRouteChange(); // Reset the message when the pathname changes
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]); // Trigger useEffect when the path changes

  useEffect(() => {
    if (popup === true) {
      setTimeout(() => {
        setMessage('');
        setError(undefined);
        setPopup(undefined);
      }, 5000);
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
