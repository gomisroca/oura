"use client"; // This makes it a client component

import { useMessage } from "@/context/MessageContext";
import { useEffect } from "react";

const MessageWrapper = ({
  message,
  error = true,
  popup = false,
}: {
  message: string;
  error?: boolean;
  popup?: boolean;
}) => {
  const { setMessage, setError, setPopup } = useMessage();

  useEffect(() => {
    setMessage(message);
    setError(error);
    setPopup(popup);
  }, [message, error, popup, setMessage, setError, setPopup]);

  return null;
};

export default MessageWrapper;
