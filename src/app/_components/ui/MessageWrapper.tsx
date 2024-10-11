"use client";

import { useMessage } from "@/context/MessageContext";
import { useEffect } from "react";

type MessageWrapperProps = {
  message: string;
  error?: boolean;
  popup?: boolean;
};

const MessageWrapper = ({
  message,
  error = true,
  popup = false,
}: MessageWrapperProps) => {
  const { setMessage, setError, setPopup } = useMessage();

  useEffect(() => {
    setMessage(message);
    setError(error);
    setPopup(popup);
  }, [message, error, popup]);

  return null;
};

export default MessageWrapper;
