import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/cleanstreet-logo.jpg";

function Navbar() {
  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <div className="navbar-left">
        <img src={logo} alt="CleanStreet Logo" className="logo-img" />
        <span className="logo-text">CleanStreet</span>
      </div>

      {/* Center: Menu */}
      <div className="navbar-center">
        <Link to="#">Dashboard</Link>
        <Link to="#">Report Issue</Link>
        <Link to="#">View Complaints</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/reportissue">Report</Link>
      </div>

      {/* Right: Auth buttons */}
      <div className="navbar-right">
        <Link to="/login" className="btn-outline">Login</Link>
        <Link to="/signup" className="btn-primary">Register</Link>
      </div>
    </nav>
  );
}

export default Navbar;
