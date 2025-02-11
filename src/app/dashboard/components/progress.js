"use client";
import { useState, useEffect } from "react";

export default function Progress() {
    // Mocked progress data
    const [individualProgress, setIndividualProgress] = useState({ name: "Your Progress", progress: 75 });
    const [teamProgress, setTeamProgress] = useState({ name: "Team Progress", progress: 55 });

    function getProgressBarColor(progress) {
        if (progress >= 80) return "bg-green-500";
        if (progress >= 50) return "bg-yellow-500";
        return "bg-red-500";
    }

    return (
        <div>
            {/* Individual Progress */}
            <div className="bg-white shadow-md rounded-lg p-4 mb-4 mt-4">
                <h3 className="font-bold text-lg mb-3 text-purple-700">Your Progress 📈</h3>
                <div className="space-y-2">
                    {/* <p>{individualProgress.name}</p> */}
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
                    {/* <p>{teamProgress.name}</p> */}
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
