// TO DO
"use client";

import React, { useEffect } from "react";
export default function ErrorMessage({
  message,
  setMessage,
}: {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [visible, setVisible] = React.useState(true);
  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    if (!visible) {
      setMessage(null);
      console.error("Error message cleared");
    }
  }, [visible, setMessage]);

  return (
    <div
      className={`error-message w-150 h-30 fixed right-3 bottom-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded ${visible ? "block" : "hidden"}`}
      role="alert"
    >
      <h2 className="text-red-600 text-xl font-bold">Error</h2>
      <p className="text-red-500">{message}</p>
    </div>
  );
}
