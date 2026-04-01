import { Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{ display: "flex" }}>
      
      {/* ✅ FIXED SIDEBAR */}
      <aside style={{
        width: "250px",
        height: "100vh",
        position: "fixed",   // 🔥 makes it fixed
        top: 0,
        left: 0,
        background: "linear-gradient(180deg, #1e3a8a, #1e40af)",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}>

        <div>
          <h2 style={{ marginBottom: "30px", fontWeight: "600" }}>
            🏛️ CleanStreet
          </h2>

          {/* MENU ITEMS */}
          {[
            { label: "📊 Overview", path: "/admin/dashboard" },
            { label: "🛠️ Manage Complaints", path: "/admin/manage-complaints" },
            { label: "👤 Profile", path: "/admin/profile" },
            
            { label: "📈 Reports", path: "/admin/report" },
          ].map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                marginBottom: "10px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              {item.label}
            </div>
          ))}
        </div>

        <div style={{ marginBottom: "15px", cursor: "pointer", padding: "10px",borderRadius:"8px"}} 
        onClick={handleLogout}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          🚪 Logout
        </div>

      </aside>

      {/* MAIN SECTION */}
      <div style={{
        marginLeft: "250px",   // 🔥 push content right
        width: "100%"
      }}>

        {/* ✅ NAVBAR */}
       

        {/* CONTENT */}
        <div style={{ padding: "20px" }}>
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default AdminLayout;