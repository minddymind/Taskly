"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Clock from "./clock";

export default function TeamData() {
  const { data: session } = useSession();
  const [currentUser, setCurrentUser] = useState(null);
  const [taskCount, setTaskCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.emp_id) return;

    const fetchUserData = async () => {
      try {
        // Fetch current user details
        const userResponse = await fetch("/api/getUser");
        if (!userResponse.ok) throw new Error("Failed to fetch user");
        const userData = await userResponse.json();

        // Fetch user's department and team members
        const deptResponse = await fetch(`/api/user?id=${userData.emp_id}`);
        if (!deptResponse.ok) throw new Error("Failed to fetch department");
        const deptData = await deptResponse.json();

        setCurrentUser({
          ...userData,
          department: deptData?.department || "Unknown Department",
          members: deptData?.members || ["No members found"],
        });

      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [session]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchTaskCount = async () => {
      try {
        const response = await fetch(`../api/tasks/owned?ownerId=${currentUser.emp_id}`);
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const tasks = await response.json();
        setTaskCount(tasks.length); // Count total tasks for the department
      } catch (error) {
        console.log("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskCount();
  }, [currentUser]);

  return (
    <div className="w-full lg:w-1/3 lg:ml-6 mt-6 lg:mt-0">
      <div className="bg-green-100 shadow-md rounded-lg p-4 mb-6">
        <h3 className="font-bold text-lg mb-3 text-green-700">Team Overview</h3>

        {loading ? (
          <p>Loading...</p>
        ) : currentUser ? (
          <ul>
            <li className="py-2">
              <span className="font-semibold">Team Members:</span> {currentUser.members.length} people
            </li>
            <li className="py-2">
              <span className="font-semibold">Current Tasks:</span> {taskCount} tasks
            </li>
            {/* <li className="py-2">
                    <span className="font-semibold">Current Projects:</span> Payment system
            </li> */}
          </ul>
        ) : (
          <p>Failed to load team data</p>
        )}
      </div>
      <Clock />
    </div>
  );
}
