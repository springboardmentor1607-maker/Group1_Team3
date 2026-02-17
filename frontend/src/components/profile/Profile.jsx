// import React, { useState } from "react";
// import ProfileEdit from "./ProfileEdit";
// import Security from "./Security";
// import "./Profile.css";

// const Profile = () => {
//   const [activeTab, setActiveTab] = useState("profile");

//   const user = JSON.parse(localStorage.getItem("user")) || {};

//   const avatarInitial = user?.name
//     ? user.name.charAt(0).toUpperCase()
//     : "?";

//   return (
//     <div className="profile-page">
//       <div className="container">
//         <div className="profile-header">
//           <h1>My Profile</h1>
//         </div>

//         <div className="profile-layout">
//           {/* Sidebar */}
//           <div className="profile-sidebar">
//             <div className="users-card">
//               <div className="user-avatar">{avatarInitial}</div>
//               <div className="user-info-block">
//                 <h3>{user?.name}</h3>
//                 <p>@{user?.username}</p>
//                 <p className="user-role">{user?.role}</p>
//               </div>
//             </div>

//             <div className="profile-nav">
//               <button
//                 className={activeTab === "profile" ? "active" : ""}
//                 onClick={() => setActiveTab("profile")}
//               >
//                 Personal Details
//               </button>

//               <button
//                 className={activeTab === "security" ? "active" : ""}
//                 onClick={() => setActiveTab("security")}
//               >
//                 Security & Privacy
//               </button>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="profile-content">
//             {activeTab === "profile" && <ProfileEdit user={user} />}
//             {activeTab === "security" && <Security user={user} />}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;
