'use client';

import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Swal from "sweetalert2";
import { LogoutIcon, HomeIcon, ClipboardListIcon } from '@heroicons/react/outline';

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("../api/getUser");
        if (!response.ok) throw new Error("Failed to fetch user");
        const data = await response.json();

        const userDeptResponse = await fetch(`../api/user?id=${data.emp_id}`);
        if (!userDeptResponse.ok) throw new Error("Failed to fetch user department");
        const userDept = await userDeptResponse.json();

        setCurrentUser({
          ...data,
          department: userDept?.department || "Unknow Department", // เพิ่มชื่อแผนก
          members: userDept?.members || ["No members found"], // เพิ่มรายชื่อสมาชิกแผนก
          avatar: `https://avatar.iran.liara.run/username?username=${data.acc_name}`
        });
      } catch (error) {
        // console.error("An error occurred while fetching the user:", error);
        console.log("An error occurred while fetching the user:",error);
      }
    };

    fetchUser();
  }, []);

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

  // Example team progress data (can be dynamic)
  const teamProgress = {
    progress: 75, // Progress in percentage
  };

  const individualProgress = {
    progress: 50, // Progress in percentage
  };

  // Function to determine the progress bar color
  const getProgressBarColor = (progress) => {
    if (progress === 100) {
      return 'bg-green-500'; // Green color for 100% completion
    } else if (progress >= 75) {
      return 'bg-blue-500'; // Blue color for progress >= 75%
    } else if (progress >= 50) {
      return 'bg-yellow-500'; // Yellow color for progress >= 50%
    } else {
      return 'bg-red-500'; // Red color for progress < 50%
    }
  };

  // Handle checkbox toggle
  const toggleTaskCompletion = (taskName) => {
    setTasks(tasks.map(task =>
      task.name === taskName ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleLogout = () => {
    // alert("Logging out..."); // เพิ่มการดำเนินการเมื่อ logout เช่น redirect หรือ clear session
    // signOut({ callbackUrl: "/login" });

    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to log out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7066e0',
      cancelButtonColor: '#545454',
      confirmButtonText: 'Yes, log out!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with logout action
        // Add your logout logic here
        console.log('Logging out...');
        signOut({ callbackUrl: "/" });
        // For example: redirect to login page or clear user data
      }
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col shadow-lg rounded-r-2xl backdrop-blur-md">
        <h1 className="text-4xl font-bold mb-8">Taskly</h1>
        <div className="flex items-center mb-6 border-t border-b border-gray-700 pt-4 pb-4">
          {/* <img src={currentUser.avatar} alt="User Avatar" className="w-12 h-12 rounded-full mr-3" /> */}
          <div>
            <span className="text-xl font-semibold">Sunny</span>
            <span className="block text-sm text-gray-500 mt-1">ID: 650510666</span>
            <span className="block text-sm text-gray-500 mt">Developer</span>
          </div>
        </div>
        <ul>
          <li className="mb-4 cursor-pointer flex items-center hover:text-blue-500 transition duration-200 ease-in-out">
            <HomeIcon className="h-6 w-6 mr-1" />
            <a href="/dashboard" className="hover:text-blue-500">Dashboard</a>
          </li>
          <li className="mb-4 cursor-pointer flex items-center hover:text-blue-500 transition duration-200 ease-in-out">
            <ClipboardListIcon className="h-6 w-6 mr-1" />
            <a href="/task" className="hover:text-blue-500">Tasks</a>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Welcome, Sunny!</h2>
          <div className="flex items-center">
            {/* <img src={currentUser.avatar} alt="User Avatar" className="w-8 h-8 rounded-full mr-2" /> */}
            <span>Log out</span>
            <button
              onClick={handleLogout}
              className="ml-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
            >
              <LogoutIcon className="w-5 h-5" href="/" />
            </button>
          </div>
        </header>
        
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-6xl mx-auto mt-10 flex flex-col lg:flex-row">
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

          <div className="w-full lg:ml-6 mt-6 lg:mt-0">
            {/* Today’s Task */}
            <div className="bg-blue-100 shadow-md rounded-lg p-4 mb-6">
              <h3 className="font-bold text-lg mb-3 text-blue-700">Today’s Task  📌 </h3>
              <ul>
                {tasks.filter(task => isTaskToday(task.deadline)).map((task, index) => {
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

          <div className="w-full lg:w-1/3 lg:ml-6 mt-6 lg:mt-0">
            {/* Team Data */}
            <div className="bg-green-100 shadow-md rounded-lg p-4 mb-6">
              <h3 className="font-bold text-lg mb-3 text-green-700">Team Overview</h3>
              <ul>
                <li className="py-2">
                  <span className="font-semibold">Team Members:</span> 5 people
                </li>
                <li className="py-2">
                  <span className="font-semibold">Current Tasks:</span> 10 tasks
                </li>
                <li className="py-2">
                  <span className="font-semibold">Current Projects:</span> Payment system
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Individual Progress */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-4 mt-4">
          <h3 className="font-bold text-lg mb-3 text-purple-700">Your Progress 📈</h3>
          <div className="space-y-2">
            <p>{individualProgress.name}</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${getProgressBarColor(individualProgress.progress)}`}
                style={{ width: `${individualProgress.progress}%` }}
              ></div>
            </div>
            <div className="text-sm text-right">{individualProgress.progress}% Complete</div>
          </div>
        </div>

        {/* Team Progress */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="font-bold text-lg mb-3 text-indigo-700">Developer Team Progress 📈</h3>
          <div className="space-y-2">
            <p>{teamProgress.name}</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${getProgressBarColor(teamProgress.progress)}`}
                style={{ width: `${teamProgress.progress}%` }}
              ></div>
            </div>
            <div className="text-sm text-right">{teamProgress.progress}% Complete</div>
          </div>
        </div>
      </div>
    </div>
  );
}
