'use client';

import { useState, useEffect } from "react";
import Calendarmini from "./components/calendar"
import Progress from "./components/progress";
import Sidebar from "./components/sidebar";
import Logout from "../components/logout";
import Tasks from "./components/tasks";
import TeamData from "./components/teamData";

export default function Dashboard() {
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

  

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar></Sidebar>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Welcome, Sunny</h2>
          {/* logout */}
          <Logout></Logout>
        </header>
        
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-6xl mx-auto mt-10 flex flex-col lg:flex-row">
          {/* calendar */}
          <Calendarmini></Calendarmini>
          <Tasks></Tasks>
          <TeamData></TeamData>
          
        </div>
        <Progress></Progress>
      </div>
    </div>
  );
}
