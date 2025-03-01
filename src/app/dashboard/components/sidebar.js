'use client'
import { HomeIcon, ClipboardListIcon } from '@heroicons/react/outline';
import { useState, useEffect } from "react";

export default function Sidebar() {
  const [currentUser, setCurrentUser] = useState(null);

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
          department: userDept?.department || "Unknown Department",
          members: userDept?.members || ["No members found"],
          avatar: `https://avatar.iran.liara.run/username?username=${data.acc_name}`
        });
      } catch (error) {
        console.log("An error occurred while fetching the user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col shadow-lg rounded-r-2xl backdrop-blur-md">
      <h1 className="text-4xl font-bold mb-8">Taskly</h1>
      <div className="flex items-center mb-6 border-t border-b border-gray-700 pt-4 pb-4">
        {currentUser ? (
          <>
            <img src={currentUser.avatar} alt="User Avatar" className="w-12 h-12 rounded-full mr-3" />
            <div>
              <span className="text-xl font-semibold">{currentUser.acc_name}</span>
              <span className="block text-sm text-gray-500 mt-1">ID: {currentUser.emp_id}</span>
              <span className="block text-sm text-gray-500 mt-1">{currentUser.department}</span>
            </div>
          </>
        ) : (
          <span>Loading...</span>
        )}
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
  );
}
