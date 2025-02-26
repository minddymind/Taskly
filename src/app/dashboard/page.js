import UserDashboard from "./components/dashboard";
import Progress from "./components/progress";
import Sidebar from "./components/sidebar";
import Logout from "../components/logout";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Welcome, Sunny</h2>
          <Logout />
        </header>
        <UserDashboard />
        <Progress />
      </div>
    </div>
  );
}
