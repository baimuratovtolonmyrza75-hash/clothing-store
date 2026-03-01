"use client";

import { useState, useEffect } from "react";

export interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

export default function Toast({ message, type, duration = 3000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  }[type];

  const icon = {
    success: "OK",
    error: "ERR",
    info: "INFO",
  }[type];

  return (
    <div
      className={`fixed bottom-6 right-6 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-[slideUp_0.3s_ease] z-[9999]`}
    >
      <span className="text-xs font-bold">{icon}</span>
      <span className="font-medium">{message}</span>
    </div>
  );
}
