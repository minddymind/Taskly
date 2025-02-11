'use client'

export default function TeamData() {
    return(
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
    );
}