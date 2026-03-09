
import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";  
const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="logo">TestSeries</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/exams">Exams</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  )
}

export default Navbar