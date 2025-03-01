"use client";  // Add this line at the very top

import { useState, useEffect } from "react";
import UserDashboard from "./components/dashboard";
import Progress from "./components/progress";
import Sidebar from "./components/sidebar";
import Logout from "../components/logout";
import { ProgressProvider, ProgressContext } from "./components/ProgressContext";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("../api/getUser");
        if (!response.ok) throw new Error("Failed to fetch user");
        const data = await response.json();
        setCurrentUser(data);
      } catch (error) {
        console.log("An error occurred while fetching the user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <ProgressProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8">
          <header className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              Welcome, {currentUser ? currentUser.acc_name : "Loading..."}
            </h2>
            <Logout />
          </header>
          <UserDashboard />
          <ProgressContext.Consumer>
            {({ progressUpdate }) => <Progress key={progressUpdate} />}
          </ProgressContext.Consumer>
        </div>
      </div>
    </ProgressProvider>
  );
}
