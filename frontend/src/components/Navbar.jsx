import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/cleanstreet-logo.jpg";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <div
        className="navbar-left"
        onClick={() => navigate("/dashboard")}
        style={{ cursor: "pointer" }}
      >
        <img src={logo} alt="CleanStreet Logo" className="logo-img" />
        <span className="logo-text">CleanStreet</span>
      </div>

      {/* Center: Menu */}
      <div className="navbar-center">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/reportissue">Report Issue</Link>
        <Link to="/complaints">View Complaints</Link>
        <Link to="/profile">Profile</Link>
      </div>

      {/* Right: Auth Section */}
      <div className="navbar-right">
        {token ? (
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#3b5bfd",
              color: "white",
              padding: "10px 28px",
              border: "none",
              borderRadius: "10px",
              fontWeight: "600",
              fontSize: "16px",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "#07103f")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "#060e37")
            }
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="btn-outline">
              Login
            </Link>
            <Link to="/signup" className="btn-primary">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;