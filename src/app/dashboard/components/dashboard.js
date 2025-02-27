"use client";
import { useEffect, useState } from "react";
import Calendarmini from "./calendar";
import Tasks from "./tasks";
import TeamData from "./teamData";

async function fetchUser() {
  try {
    const response = await fetch("../api/getUser");
    if (!response.ok) throw new Error("Failed to fetch user");
    const data = await response.json();

    const userDeptResponse = await fetch(`../api/user?id=${data.emp_id}`);
    if (!userDeptResponse.ok) throw new Error("Failed to fetch user department");
    const userDept = await userDeptResponse.json();

    return {
      ...data,
      department: userDept?.department || "Unknown Department",
      members: userDept?.members || ["No members found"],
      avatar: `https://avatar.iran.liara.run/username?username=${data.acc_name}`,
    };
  } catch (error) {
    console.log("An error occurred while fetching the user:", error);
    return null;
  }
}

export default function UserDashboard() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchUser().then(setCurrentUser);
  }, []);

  // if (!currentUser) return <div>Loading...</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-6xl mx-auto mt-10 flex flex-col lg:flex-row">
      <Calendarmini />
      <Tasks />
      <TeamData />
    </div>
  );
}
