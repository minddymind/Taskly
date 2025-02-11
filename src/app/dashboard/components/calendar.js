'use client'

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState, useEffect } from "react";

export default function Calendarmini() {
  const [selectedDate, setSelectedDate] = useState(new Date());
    return (
        <div className="w-full lg:w-2/3">
            <h3 className="font-bold text-lg mb-3 text-center">Calendar</h3>
            <Calendar 
              onChange={setSelectedDate} 
              value={selectedDate} 
              tileClassName="rounded-lg"
              next2Label={null} prev2Label={null}
              nextLabel=">" prevLabel="<"
              minDetail="month"
              showNeighboringMonth={false}
            />
          </div>
    );
}