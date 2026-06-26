import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "./MainLayout.css";

const MainLayout = () => {
  return (
    <div className="layout">
      <Navbar />

      <main className="mainContent">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;