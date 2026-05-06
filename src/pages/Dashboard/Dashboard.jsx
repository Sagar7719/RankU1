import Sidebar from "./Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">   {/* 🔥 ADD THIS */}

      <Sidebar />

      <div className="dashboard-content">
        <Outlet />
      </div>

    </div>
  );
};

export default Dashboard;