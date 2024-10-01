'use client';

import { useMessage } from "@/context/MessageContext";

const Message = () => {
  const { message, error, popup } = useMessage();

  if (!message) return null;
  return (
    <div
      className={`fixed m-auto left-0 right-0 z-[99] w-[90vw] xl:w-[30vw] flex flex-col items-center justify-center gap-2 px-5 py-2 font-semibold border rounded-lg ${
        error
          ? 'border-red-500 bg-red-200/90 dark:bg-red-800/90'
          : 'border-green-500 bg-green-200/90 dark:bg-green-800/90'
      } ${popup ? 'bottom-10' : 'bottom-unset'}`}
    >
      <p>{error ? "An error occurred" : "Success"}</p>
      <h1 className='text-xl'>{message}</h1>
      <p>{error ? "Please try again" : ""}</p>
    </div>
  );
};

export default Message;
