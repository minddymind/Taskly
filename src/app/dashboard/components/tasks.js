'use client'

import { useState, useEffect } from "react";


export default function Tasks() {
    // Example task list with deadlines in ISO format for easier date manipulation
  const [tasks, setTasks] = useState([
    { name: "Working on Asia Project", deadline: "2025-02-17T08:00:00", completed: false },
    { name: "Team Meeting", deadline: "2025-02-15T10:00:00", completed: false },
    { name: "Doing Research", deadline: "2025-02-16T12:00:00", completed: false },
    { name: "Submit Report", deadline: "2025-02-18T17:00:00", completed: false },
    { name: "Submit Report", deadline: "2025-02-11T17:00:00", completed: false },
  ]);

  // Function to calculate the days left until the deadline
  const getDaysLeft = (deadline) => {
    const now = new Date();
    const taskDeadline = new Date(deadline);
    const timeDiff = taskDeadline - now;
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert time difference to days
    return daysLeft;
  };

  // Function to check if a task is for today
  const isTaskToday = (deadline) => {
    const now = new Date();
    const taskDeadline = new Date(deadline);
    return (
      now.getFullYear() === taskDeadline.getFullYear() &&
      now.getMonth() === taskDeadline.getMonth() &&
      now.getDate() === taskDeadline.getDate()
    );
  };

  // Handle checkbox toggle
  const toggleTaskCompletion = (taskName) => {
    setTasks(tasks.map(task =>
      task.name === taskName ? { ...task, completed: !task.completed } : task
    ));
  };
    return (
        <div className="w-full lg:ml-6 mt-6 lg:mt-0">
            {/* Today’s Task */}
            <div className="bg-blue-100 shadow-md rounded-lg p-4 mb-6">
              <h3 className="font-bold text-lg mb-3 text-blue-700">Today’s Task  📌 </h3>
              <ul>
                {tasks.filter(task => isTaskToday(task.deadline)).map((task, index) => { 
                  return (
                    <li key={index} className="py-2 flex items-center">
                      <input 
                        type="checkbox" 
                        checked={task.completed} 
                        onChange={() => toggleTaskCompletion(task.name)} 
                        className="mr-2"
                      />
                      {task.name} - <span className="text-gray-500">{task.deadline.slice(11, 16)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Reminder */}
            <div className="bg-yellow-100 shadow-md rounded-lg p-4">
              <h3 className="font-bold text-lg mb-3 text-yellow-700">Reminder 🔔</h3>
              <ul>
                {tasks.filter(task => !isTaskToday(task.deadline)).map((task, index) => {
                  const daysLeft = getDaysLeft(task.deadline);
                  return (
                    <li key={index} className="py-2 flex items-center">
                      <input 
                        type="checkbox" 
                        checked={task.completed} 
                        onChange={() => toggleTaskCompletion(task.name)} 
                        className="mr-2"
                      />
                      {task.name} - <span className="text-gray-500">{task.deadline.slice(11, 16)}</span>
                      <span className="ml-2 text-red-500">{daysLeft} days left</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
    );
}