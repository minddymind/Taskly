"use client";

import { useState, useEffect } from "react";

export default function Clock() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));

    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!time) return <div className="bg-gray-800 text-white text-lg font-semibold text-center py-6 px-4 rounded-lg shadow-md">Loading...</div>;

  return (
    <div className="bg-gray-800 text-white text-lg font-semibold text-center py-6 px-4 rounded-lg shadow-md">
      {time}
    </div>
  );
}
