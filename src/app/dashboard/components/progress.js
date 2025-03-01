"use client";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react"; // To get the session and user details

export default function Progress() {
    const [individualProgress, setIndividualProgress] = useState({ name: "Your Progress", progress: 0 });
    const [teamProgress, setTeamProgress] = useState({ name: "Team Progress", progress: 0 });
    const [session, setSession] = useState(null);

    // Function to get the progress bar color based on percentage
    function getProgressBarColor(progress) {
        if (progress >= 80) return "bg-green-500";
        if (progress >= 50) return "bg-yellow-500";
        return "bg-red-500";
    }

    // Fetch user session
    useEffect(() => {
        const fetchSession = async () => {
            const sessionData = await getSession();
            setSession(sessionData);
        };

        fetchSession();
    }, []); // Fetch session on mount

    // Fetch tasks and calculate progress based on the department
    useEffect(() => {
        const fetchProgressData = async () => {
            if (!session?.user?.emp_id) return;

            try {
                // Fetch user info (this could be an API endpoint to get department)
                const userResponse = await fetch("/api/getUser");
                const userData = await userResponse.json();

                const departmentId = userData.departmentId;

                // Fetch tasks for individual progress (from the user's own tasks)
                const individualTasksResponse = await fetch(`/api/tasks/owned?ownerId=${userData.emp_id}`);
                const individualTasksData = await individualTasksResponse.json();

                // Filter individual tasks where owner_id matches the current user (emp_id)
                const filteredIndividualTasks = individualTasksData.filter(task => task.owner_id === userData.emp_id);
                const totalIndividualTasks = filteredIndividualTasks.length;
                const completedIndividualTasks = filteredIndividualTasks.filter(task => task.progress_status === 'completed').length;

                // Calculate the individual progress percentage
                const individualProgress = totalIndividualTasks === 0 ? 0 : Math.round((completedIndividualTasks / totalIndividualTasks) * 100);
                setIndividualProgress({ name: "Your Progress", progress: individualProgress });

                // Fetch tasks for the department (team progress)
                const teamTasksData = individualTasksData;

                // Filter team tasks where owner_id matches any member in the department
                // const filteredTeamTasks = teamTasksData.filter(task => task.owner_id === userData.emp_id || task.department_id === departmentId);
                const totalTeamTasks = teamTasksData.length;
                const completedTeamTasks = teamTasksData.filter(task => task.progress_status === 'completed').length;

                // Calculate the team progress percentage
                const teamProgress = totalTeamTasks === 0 ? 0 : Math.round((completedTeamTasks / totalTeamTasks) * 100);
                setTeamProgress({ name: "Team Progress", progress: teamProgress });

            } catch (error) {
                console.error("Error fetching tasks or progress:", error);
            }
        };

        if (session) {
            fetchProgressData();
        }
    }, [session]); // Trigger this effect when the session is available

    return (
        <div>
            {/* Individual Progress */}
            <div className="bg-white shadow-md rounded-lg p-4 mb-4 mt-4">
                <h3 className="font-bold text-lg mb-3 text-purple-700">Your Progress 📈</h3>
                <div className="space-y-2">
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
    );
}
