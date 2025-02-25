'use client';

import { useState, useEffect } from "react";

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gray-800 text-white text-lg font-semibold text-center py-6 px-4 rounded-lg shadow-md">
      {time.toLocaleTimeString()}
    </div>
  );
}
