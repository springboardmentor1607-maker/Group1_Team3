import { useState } from "react";
import ProfileEdit from "../components/profile/ProfileEdit";
import Security from "../components/profile/Security";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const avatarInitial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : "?";


    

  return (
    <div style={{ background: "#f4f6f9", minHeight: "100vh", padding: "30px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ margin: 0 }}>My Profile</h1>
        </div>

        {/* Layout */}
        <div style={{ display: "flex", gap: "30px" }}>

          {/* Sidebar */}
          <div
            style={{
              width: "300px",
              background: "#ffffff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}
          >
            {/* User Card */}
            <div style={{ textAlign: "center", marginBottom: "25px" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "#4f46e5",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  fontWeight: "bold",
                  margin: "0 auto 15px"
                }}
              >
                {avatarInitial}
              </div>

              <h3 style={{ margin: "5px 0" }}>{user?.name}</h3>
              <p style={{ margin: 0, color: "#666" }}>@{user?.username}</p>
              <p style={{ margin: "5px 0", color: "#4f46e5" }}>
                {user?.role}
              </p>
            </div>

            {/* Navigation */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                onClick={() => setActiveTab("profile")}
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  background:
                    activeTab === "profile" ? "#4f46e5" : "#e5e7eb",
                  color: activeTab === "profile" ? "#fff" : "#000"
                }}
              >
                Personal Details
              </button>

              <button
                onClick={() => setActiveTab("security")}
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  background:
                    activeTab === "security" ? "#4f46e5" : "#e5e7eb",
                  color: activeTab === "security" ? "#fff" : "#000"
                }}
              >
                Security & Privacy
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              flex: 1,
              background: "#ffffff",
              padding: "25px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}
          >
            {activeTab === "profile" && <ProfileEdit user={user} />}
            {activeTab === "security" && <Security user={user} />}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
