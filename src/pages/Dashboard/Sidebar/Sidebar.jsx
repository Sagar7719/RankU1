import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      

      <div className="profile">
        <div className="avatar">👤</div>
        <h3>Mayuri</h3>
        <p>Student ID: #a2eb2</p>
      </div>


      <ul className="menu">

        <li className={location.pathname === "/dashboard" ? "active" : ""}>
          <Link to="/dashboard">Overview</Link>
        </li>

        <li className={location.pathname.includes("/dashboard/analytics") ? "active" : ""}>
          <Link to="/dashboard/analytics">Analytics</Link>
        </li>

        <li className={location.pathname.includes("/dashboard/library") ? "active" : ""}>
          <Link to="/dashboard/library">Library</Link>
        </li>

      </ul>
    </div>
  );
};

export default Sidebar;