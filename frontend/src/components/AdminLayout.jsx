import { Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex" }}>

      {/* ✅ BLUE SIDEBAR */}
      <aside style={{
        width: "250px",
        height: "100vh",
        background: "linear-gradient(180deg, #1e3a8a, #1e40af)",
        color: "white",
        padding: "20px"
      }}>

        <h2 style={{ marginBottom: "30px" }}>🏛️ CleanStreet Admin</h2>

        <div style={{ marginBottom: "15px", cursor: "pointer" }}
          onClick={() => navigate("/admin/dashboard")}>
          📊 Overview
        </div>

        <div style={{ marginBottom: "15px", cursor: "pointer" }}
          onClick={() => navigate("/admin/manage-complaints")}>
          🛠️ Manage Complaints
        </div>
        <div style={{ marginBottom: "15px", cursor: "pointer"}}
            onClick={()=> navigate("/admin/profile")}>
                👤 Profile
        </div>
        <div style={{ marginBottom: "15px" }}>
          👥 Users
        </div>

        <div style={{ marginBottom: "15px" }}>
          📈 Reports
        </div>

      </aside>

      {/* CONTENT */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>

    </div>
  );
}

export default AdminLayout;