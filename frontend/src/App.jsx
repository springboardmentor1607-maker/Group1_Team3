import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword";
import ProtectedRoute from "./component/ProtectedRoute.jsx";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/profile";
import ReportIssue from "./Pages/ReportIssue.jsx";
import Chatbot from "./components/Chatbot";
import ViewComplaints from "./Pages/ViewComplaints";
import ComplaintDetails from "./Pages/ComplaintsDetails";
import AdminDashboard from "./Pages/AdminDashboard.jsx";
import { Navigate } from "react-router-dom";
import VolunteerDashboard from "./Pages/VolunteerDashboard.jsx";
import ManageComplaint from "./Pages/ManageComplaint";
import VolunteerLayout from "./components/volunteer/VolunteerLayout";
import DashboardOverview from "./Pages/volunteer/DashboardOverview";
import MyComplaints from "./Pages/volunteer/MyComplaints";
import ProfilePage from "./Pages/ProfilePage";
import ComplaintReport from "./Pages/ComplaintReport";
import AdminLayout from "./components/AdminLayout";
import LandingPage from "./Pages/LandingPage";



function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = [
    "/dashboard",
    "/admin-dashboard",
    "/manage-complaints",
    "/volunteer",
    "/admin/report",
    "/admin",
    "/volunteer",
    "/"
  ];

  const hideNavbar = hideNavbarRoutes.some(route =>
    location.pathname.startsWith(route)
  );
  return (
    <>
       
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        
        
        
        <Route path="/dashboard" element = {
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reportissue"
          element={
            <ProtectedRoute>
              <ReportIssue />
            </ProtectedRoute>
          }
        />
        
        <Route path="/manage-complaints" element = {<ProtectedRoute><ManageComplaint/></ProtectedRoute>} />

        {/* ✅ NEW ROUTES ADDED BELOW */}

        <Route
          path="/complaints"
          element={
            <ProtectedRoute>
              <ViewComplaints />
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaint/:id"
          element={
            <ProtectedRoute>
              <ComplaintDetails />
            </ProtectedRoute>
          }
        />


        <Route path="/admin"element={
          <ProtectedRoute>
            <AdminLayout />
            </ProtectedRoute>
          }
        >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="manage-complaints" element={<ManageComplaint />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="report" element={<ComplaintReport />} />

        </Route>

          <Route path="/volunteer-dashboard" element = {<ProtectedRoute>
            <VolunteerDashboard/>
          </ProtectedRoute>}/>


            {/* //this is volunteer routes */}
            <Route path="/volunteer" element ={<ProtectedRoute><VolunteerLayout/></ProtectedRoute>}>
              <Route index element = {<DashboardOverview/>}/>
              <Route path="complaints" element = {<MyComplaints/>}/>
              <Route path="in-progress" element = {<MyComplaints statusFilter="in_progress"/>}/>
              <Route path="resolved" element = {<MyComplaints statusFilter={"resolved"}/>}/>
            </Route>
          

          


          <Route path="*" element={<Navigate to="/login" />} />
      </Routes>

      <Chatbot />
    </>
  );
}

function App() {
  return (
    
      <AppContent />
    
  );
}

export default App;