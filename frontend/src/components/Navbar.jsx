import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/cleanstreet-logo.jpg";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ Added user
  const user = JSON.parse(localStorage.getItem("user"));

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
        onClick={() =>
          navigate(user?.role === "admin" ? "/admin/dashboard" : "/dashboard")
        }
        style={{ cursor: "pointer" }}
      >
        <img src={logo} alt="CleanStreet Logo" className="logo-img" />
        <span className="logo-text">CleanStreet</span>
      </div>

      {/* Center: Menu */}
      <div className="navbar-center">

        {/* 👤 USER */}
        {user?.role === "user" && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/reportissue">Report Issue</Link>
          </>
        )}

        {/* 🛠️ ADMIN */}
        {user?.role === "admin" && (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/manage-complaints">Manage Complaints</Link>
          </>
        )}

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