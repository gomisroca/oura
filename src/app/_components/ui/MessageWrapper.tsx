"use client";

import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { messageAtom } from "@/atoms/message";

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
  const setMessage = useSetAtom(messageAtom);

  useEffect(() => {
    setMessage({ message, error, popup });
  }, [message, error, popup]);

  return null;
};

export default MessageWrapper;
